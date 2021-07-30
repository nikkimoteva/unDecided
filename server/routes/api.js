const express = require('express');
const router = express.Router();

const JobModel = require("../database/models/Job");
const csv = require('jquery-csv');
const {storeCSV} = require("../FileManager");
const {getUserId} = require("../Util");
const { v4: uuidv4 } = require('uuid');
const {} = require("../Util");
const {NodeSSH} = require("node-ssh");
const { readFilePromise, csvToArrays, csvToObject, arraysToCsv, runPredict, trainPipeline, forwardOutPromise, errorHandler} = require("../Util");

const aws = require("./AWSRoutes");
const jobs = require("./JobRoutes");
const auth = require("./AuthRoutes");
router.use('/auth', auth);
router.use('/jobs', jobs);
router.use('/aws', aws);

const user = 'blkbx-ml';
const password = '1qaz2wsx';

router.get("/test", (req, res) => {
  res.sendStatus(200);
});


router.post('/tableView', (req, res) => {
  const user_email = req.body.email;
  const target_name = req.body.target;
  const search_time = req.body.maxJobTime;
  let nickname = req.body.nickName;

  const file_name = req.body.fileHash;
  const train_path = "../../../research/plai-scratch/BlackBoxML/bbml-backend-3/ensemble_squared/datasets/" + file_name + "/train.csv";
  const local_path = "./server/" + file_name + ".csv";


  if (!nickname || nickname.length === 0) {
    nickname = "auto generated nickname";
  }
  const ssh1 = new NodeSSH();
  const ssh2 = new NodeSSH();

  ssh1.connect({
    host: 'remote.cs.ubc.ca',
    username: user,
    password: password
  })
    .then(() => forwardOutPromise(ssh1.connection, ssh2))
    .then(() => {
      console.log("Success connecting to borg");
      return ssh2.putFile(local_path, train_path);
    })
    .then(() => readFilePromise(local_path))
    .then(fileContent => {
      const fileArray = csv.toArrays(fileContent);
      const headers = fileArray[0];
      const idx = headers.indexOf(target_name);
      const newJob = new JobModel(
        {
          fileHash: file_name,
          name: nickname,
          headers: headers,
          target_column: idx,
          target_name: target_name,
          email: user_email,
          timer: search_time,
          status: 'SUBMITTED',
          user: req.body.user
        });

      return newJob.save();
    })
    .then(() => {
      const trainString = trainPipeline(train_path, target_name, user_email, file_name, search_time, nickname);
      return ssh2.exec(trainString, []);
    })
    .then(msg => {
      res.status(200);
      res.send(msg);
    })
    .catch(err => {
      errorHandler(err);
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
    const ssh1 = new NodeSSH();
    const ssh2 = new NodeSSH();

    ssh1.connect({
      host: 'remote.cs.ubc.ca',
      username: user,
      password: password
    })
      .then(() => forwardOutPromise(ssh1.connection, ssh2))
      .then(() => {
        console.log("Success!");
        ssh2.execCommand("hostname").then(res => console.log(res.stdout));
      })
      .catch(err => {
        console.log(err);
      });

    const test_file_name = uuidv4();
    const folder_path = '/ubc/cs/research/plai-scratch/BlackBoxML/bbml-backend-3/ensemble_squared/datasets' + search_id;
    const test_path = folder_path + '/' + test_file_name + '/train.csv';

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
