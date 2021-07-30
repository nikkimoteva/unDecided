const express = require('express');
const router = express.Router();

const JobModel = require("../database/models/Job");
const csv = require('jquery-csv');
const { storeCSV } = require("../FileManager");
const { getUserId, makeid } = require("../Util");
const { v4: uuidv4 } = require('uuid');
const {NodeSSH} = require("node-ssh");
const { readFilePromise, csvToArrays, csvToObject, arraysToCsv, runPredict, trainPipeline, forwardOutPromise, errorHandler} = require("../Util");
const { writeFile } = require('fs').promises;

const aws = require("./AWSRoutes");
const jobs = require("./JobRoutes");
const auth = require("./AuthRoutes");
const { ssh_user, borg_dataset_directory, remote_ssh, ssh_pw, slurm_command_dataset_path } = require('../../src/SecretHandler.js');
router.use('/auth', auth);
router.use('/jobs', jobs);
router.use('/aws', aws);

router.get("/test", (req, res) => {
  res.sendStatus(200);
});


router.post('/submitJob', (req, res) => {
  const user_email = req.body.email;
  const target_name = req.body.targetColName;
  const search_time = req.body.maxJobTime;
  let nickname = req.body.jobName;

  const file = req.body.data;

  const file_name = uuidv4();
  const train_path = borg_dataset_directory + file_name + "/train.csv";
  const local_path = "./server/training/" + file_name + ".csv";

  if (!nickname || nickname.length === 0) {
    nickname = "auto generated nickname";
  }

  const ssh1 = new NodeSSH();
  const ssh2 = new NodeSSH();

  storeCSV(file, local_path)
    .then(() => {
      console.log("wrote file successfully");
      return ssh1.connect({
        host: remote_ssh,
        username: ssh_user,
        password: ssh_pw
      });
    })
    .then(() => {
      return forwardOutPromise(ssh1.connection, ssh2);
    })
    .then(() => {
      console.log("Success connecting to borg");
      ssh2.putFile(local_path, train_path);
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
          user: req.body.id_token
        });
      return newJob.save();
    })
    .then(() => {
      const targetPath = slurm_command_dataset_path + file_name + '/' + 'train.csv';
      const trainString = trainPipeline(targetPath, target_name, user_email, file_name, search_time, nickname);
      return ssh2.exec(trainString, []);
    })
    .then(msg => {
      res.status(200);
      res.send({ borg_stdout: msg, fileHash: file_name });
    })
    .catch(err => {
      errorHandler(err, res);
    });
});

router.post('/pipeline', (req, res) => {
  const search_id = req.body.search_id;
  const email = req.body.email;
  const uploaded_file = req.body.data;

  if (uploaded_file.size === 0) {
    errorHandler({ 'msg': 'Uploaded file is empty' }, res);
  }

  const test_file_name = makeid(4);
  const folder_path = slurm_command_dataset_path + search_id;
  const test_path = folder_path + '/' + test_file_name + '.csv';
  const local_path = './server/predictions/' + search_id + '.csv';
  const ssh1 = new NodeSSH();
  const ssh2 = new NodeSSH();
  ssh1.connect({
    host: remote_ssh,
    username: ssh_user,
    password: ssh_pw
  })
    .then(() => forwardOutPromise(ssh1.connection, ssh2))
    .then(() => {
      console.log("Success!");
      storeCSV(uploaded_file, local_path);
    })
    .then(() => {
      return readFilePromise(local_path);
    })
    .then(fileContent => {
      return csvToArrays(fileContent);
    })
    .then(data => {
      const testColumns = data[0];
      return JobModel.findOne({ fileHash: search_id })
        .then(job => {

          if (!(testColumns.includes(job.target_name))) { // gotta push the target column into the file!
            testColumns.push(job.targetName);
            data[0] = testColumns;
            const newFile = csv.fromArrays(data);

            return storeCSV(newFile, local_path)
              .then(() => {
                ssh2.putFile(local_path, test_path);
              })
              .then(() => {
                const predictString = runPredict(test_path, search_id, job.timer, job.target_name, email, job.name);
                ssh2.exec(predictString, []).then(() => {
                  res.status(200);
                  res.send({ 'msg': 'Success!' });
                });
              });
          }

          else {
            const predictString = runPredict(test_path, search_id, job.timer, job.target_name, email, job.name);
            return ssh2.exec(predictString, []).then(msg => {
              res.status(200);
              res.send({ 'msg': msg });
            });
          }
        });
    })
    .catch(err => {
      errorHandler(err);
  });
});

module.exports = router;
