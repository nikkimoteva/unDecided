const express = require('express');
const router = express.Router();

const JobModel = require("../database/models/Job");
const csv = require('jquery-csv');
const { storeCSV } = require("../FileManager");
const { makeid } = require("../Util");
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
            testColumns.push(job.target_name);
            data[0] = testColumns;
            const newFile = csv.fromArrays(data);

            return storeCSV(newFile, local_path)
              .then(() => ssh2.putFile(local_path, test_path))
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
