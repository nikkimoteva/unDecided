const express = require('express');
const JobModel = require("../database/models/Job");
const PredictionModel = require("../database/models/Prediction");
const {runPredict} = require("../Util");
const {csvToArrays} = require("../Util");
const {makeid} = require("../Util");
const router = express.Router();
const {errorHandler, getUserId, connect} = require("../Util");
const {trainPipeline} = require("../Util");
const {storeCSV} = require("../FileManager");
const {borg_dataset_directory, slurm_command_dataset_path} = require('../../src/SecretHandler');
const {v4: uuidv4} = require('uuid');

router.get("/", (req, res) => {
  res.sendStatus(200);
});

router.post("/", (req, res) => {
  const id_token = req.body.id_token;
  JobModel.find({user: id_token})
    .then(jobs => {
      return res.json(jobs);
    })

    .catch(err => errorHandler(err, res));
});

router.post("/job", (req, res) => {
  const id_token = req.body.id_token;
  const jobID = req.body.jobID;
  JobModel.find({user: id_token, _id: jobID})
    .then(job => {
      return res.json(job);
    })

    .catch(err => errorHandler(err, res));
});

router.delete("/deleteJob", (req, res) => {
  const id_token = req.body.id_token;
  const jobId = req.body.jobId;
  getUserId(id_token)
    .then(userToken => JobModel.deleteOne({user: userToken, _id: jobId})
      .then(_ => res.sendStatus(200)))
    .catch(err => errorHandler(err, res));
});


router.post("/submitTrainJob", (req, res) => {
  console.log(req.body);
  const {id_token, jobName, maxJobTime, targetColumnName, dataset, header} = req.body;
  const targetColumn = header.indexOf(targetColumnName);
  const file_name = uuidv4();
  const train_path = borg_dataset_directory + file_name + "/train.csv";
  const local_path = "/home/kians376/repos/cs455/unDecided/server/training/" + file_name + ".csv";
  const targetPath = slurm_command_dataset_path + file_name + '/' + 'train.csv';
  const job = new JobModel({
    name: jobName,
    user: id_token,
    fileHash: file_name,
    target_name: targetColumnName,
    target_column: targetColumn,
    timer: maxJobTime,
    headers: header,
    created: Date()
  });
  let trainString;

  // if (jobName.length === 0) jobName = "auto generated nickname";
  storeCSV(dataset, local_path)
    .then(() => getUserId(id_token))
    .then(user_email => {
      trainString = trainPipeline(targetPath, targetColumnName, user_email, file_name, maxJobTime, jobName);
    })
    .then(() => connect())
    .then(borg => {
      console.log("Success connecting to borg");
      return borg.putFile(local_path, train_path)
        .then(() => borg.exec(trainString, []));
    })
    .then(() => job.save())
    .then(msg => res.send({borg_stdout: msg, fileHash: file_name}))
    .catch(err => errorHandler(err, res));
});

router.post("/predictions", (req, res) => {
  const id_token = req.body.id_token;
  const jobID = req.body.jobID;
  PredictionModel.find({user: id_token, jobID: jobID})
    .then(predictions => {
      return res.json(predictions);
    })

    .catch(err => errorHandler(err, res));
});

router.post("/submitPrediction", (req, res) => {
  const {id_token, predictionName, jobID, dataset} = req.body;
  let email;
  const prediction = new PredictionModel({
    name: predictionName,
    user: id_token,
    jobID: jobID,
    created: Date()
  });

  const test_file_name = makeid(4);


  getUserId(id_token)
    .then(userId => {
      email = userId;
      return JobModel.findOne({_id: jobID});
    })
    .then(job => {
      // if (!(job.headers.includes(job.target_name))) { // gotta push the target column into the file!
      //   const a = job.headers;
      //   a.push(job.target_name);
      //   data[0] = testColumns;
      //   const newFile = csv.fromArrays(data);
      //
      const folder_path = slurm_command_dataset_path + job.fileHash;
      const test_path = folder_path + '/' + test_file_name + '.csv';
      const local_path = '/home/kians376/repos/cs455/unDecided/server/predictions/' + job.fileHash + '.csv';
      const predictString = runPredict(test_path, job.fileHash, job.timer, job.target_name, email, job.name);

      return storeCSV(dataset, local_path)
        .then(() => connect())
        .then(borg => {
            return borg.putFile(local_path, test_path)
              .then(() => borg.exec(predictString, []));
          });
      })
    .then(() => prediction.save())
    .then(() => res.sendStatus(200))
    .catch(err => errorHandler(err, res));
});

router.delete("/deletePrediction", (req, res) => {
  const id_token = req.body.id_token;
  const predictionID = req.body.predictionID;
  getUserId(id_token)
    .then(userToken => PredictionModel.deleteOne({user: userToken, _id: predictionID}))
    .then(_ => res.sendStatus(200))
    .catch(err => errorHandler(err, res));
});

router.post("/downloadPrediction", (req, res) => {
  const id_token = req.body.id_token;
  const predictionID = req.body.predictionID;
  const localPath = "../temp/predictionFile.csv";

  getUserId(id_token)
    .then(userToken => {
      return PredictionModel.findOne({user: userToken, _id: predictionID})
        .then(pred => JobModel.findOne({user: userToken, _id: pred.jobID}));
    })
    .then(trainJob => {
      const fileHash = trainJob.fileHash;
      const timer = trainJob.timer;
      const seed = 's0';
      const remotePath = `ensemble_squared_2/ensemble_squared/sessions/${fileHash}/ensemble/${timer}_${seed}/voting/full_ensemblesquared.csv`;
      return connect()
        .then(borg => borg.getFile(localPath, remotePath));
    })
    .then(() => res.attachment(localPath))
    .catch(err => errorHandler(err, res));
});

router.delete("/deletePredictionJobID", (req, res) => {
  const id_token = req.body.id_token;
  const jobID = req.body.jobID;
  console.log(jobID);
  getUserId(id_token)
    .then(userId => PredictionModel.deleteMany({user: userId, jobID: jobID})
      .then(_ => res.sendStatus(200)))
    .catch(err => errorHandler(err, res));
});

module.exports = router;
