const express = require('express');
const router = express.Router();

const JobModel = require("../database/models/Job");
const csv = require('jquery-csv');
const {storeCSV} = require("../FileManager");
const {getUserId} = require("../Util");

const { readFilePromise, csvToArrays, csvToObject, arraysToCsv, runPredict, trainPipeline, errorHandler} = require("../Util");

const aws = require("./AWSRoutes");
const jobs = require("./JobRoutes");
const auth = require("./AuthRoutes");
router.use('/aws', aws);
router.use('/jobs', jobs);
router.use('/auth', auth);

router.get("/test", (req, res) => {
  res.sendStatus(200);
});


router.post('/tableView', (req, res) => {
  const user_email = req.body.email;
  const target_name = req.body.target;
  const search_time = req.body.maxJobTime;
  let nickname = req.body.nickName;

  if (!nickname || nickname.length === 0) {
    nickname = "auto generated nickname";
  }
  const file_name = req.body.fileHash;
  const train_path = './scratch/users_csv/' + file_name + '.csv';

  readFilePromise(train_path).then(fileContent => {
    const fileArray = csvToArrays(fileContent);
    const headers = fileArray[0];
    const idx = headers.findIndex(target_name);
    const newJob = new JobModel(
      {
        fileHash: file_name,
        name: nickname,
        headers: headers,
        target_column: idx,
        target_name: target_name,
        email: user_email,
        timer: search_time,
        status: 'SUBMITTED'
      });

    newJob.save(err => {
      if (err) {
        errorHandler(err, res);
      }
    });

    try {
      trainPipeline();
      res.status(200);
    } catch (err) {
      errorHandler(err);
    }
  });
});

router.post('/pipeline', (req, res) => {
  const search_id = req.body.search_id;
  const email = req.body.email;
  const uploaded_file = req.files.file;

  if (uploaded_file.size === 0) {
    errorHandler({ 'msg': 'Uploaded file is empty' }, res);
  }

  try {
    const test_file_name = makeid(4);
    const folder_path = './scratch/users_csv/' + search_id;
    const test_path = folder_path + '/' + test_file_name + '.csv';

    storeCSV(uploaded_file, test_path)
      .then(() => {
        return readFilePromise(test_path);
      })
      .then(fileContent => {
        return csvToArrays(fileContent);
        // const testColumns = Object.keys(util.parseCSVToArr(test_path)[0]);
      })
      .then(data => {
        const testColumns = data[0];
        const job = {}; // TODO: get job from db using search_id
        const oldColumns = job.headers;

        if (job.status !== 'SUCCESSFUL') {
          res.status(400);
          res.send({ 'msg': 'Your job has not completed training! Try again later.' });
        }
        if (!(job.targetName in testColumns)) {
          testColumns.push(job.targetName);
          data[0] = testColumns;
          const newFile = csv.fromArrays(data);
          storeCSV(newFile, test_path)
            .then(() => {
              runPredict(test_path, search_id, job.timer, job.target_name, email, job.name);
              res.status(200);
              res.send({ 'msg': 'Success!' });
            });
        }
        if (oldColumns.length !== testColumns.length) {
          errorHandler({ 'msg': 'csv missing columns' }, res);
        }
        else {
          runPredict(test_path, search_id, job.timer, job.target_name, email, job.name);
          res.status(200);
          res.send({ 'msg': 'Success!' });
        }
      });
  } catch (err) {
    errorHandler(err, res);
  }
});

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = router;
