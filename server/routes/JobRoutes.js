const express = require('express');
const JobModel = require("../database/models/Job");
const PredictionModel = require("../database/models/Prediction");
const router = express.Router();
const {errorHandler, getUserId} = require("../Util");
const multer = require('multer');
const upload = multer({ dest: './temp/' });

router.get("/", (req, res) => {
  res.sendStatus(200);
});

router.post("/", (req, res) => {
  const id_token = req.body.id_token;
  JobModel.find({user: id_token})
    .then(jobs =>{
      return res.json(jobs);
    })

    .catch(err => errorHandler(err, res));
});

router.delete("/deleteJob", (req, res) => {
  const id_token = req.body.id_token;
  const jobId = req.body.jobId;
  getUserId(id_token)
    .then(userToken => JobModel.deleteOne({user: userToken, _id: jobId })
      .then(_ => res.sendStatus(200)))
    .catch(err => errorHandler(err, res));
});


router.post("/submitTrainJob", (req, res) => {
  const body = req.body;
  const id_token = body.id_token;
  const jobName = body.jobName;
  const maxJobTime = body.maxJobTime;
  const targetColumnName = body.targetColumnName;
  const header = body.header;
  const targetColumn = header.indexOf(targetColumnName);
  const dataset = body.dataset;
  const job = new JobModel({
    name: jobName,
    user: id_token,
    // fileHash: fileHash,
    target_name: targetColumnName,
    target_column: targetColumn,
    timer: maxJobTime,
    headers: header
  });
  job.save()
    .then(_ => res.sendStatus(200))
    .catch(err => errorHandler(err, res));
});

router.post("/predictions", (req, res) => {
  const id_token = req.body.id_token;
  const jobID = req.body.jobID;
  PredictionModel.find({user: id_token, jobID: jobID})
    .then(predictions =>{
      return res.json(predictions);
    })

    .catch(err => errorHandler(err, res));
});

router.post("/submitPrediction", (req, res) => {
  const body = req.body;
  const id_token = body.id_token;
  const predictionName = body.predictionName;
  const jobID = body.jobID;
  const prediction = new PredictionModel({
    name: predictionName,
    user: id_token,
    jobID:jobID
  });
  prediction.save()
    .then(_ => {
      return res.sendStatus(200);
    })
    .catch(err => errorHandler(err, res));
});

router.delete("/deletePrediction", (req, res) => {
  const id_token = req.body.id_token;
  const predictionID = req.body.predictionID;
  getUserId(id_token)
    .then(userToken => PredictionModel.deleteOne({ user: userToken, _id: predictionID }))
    .then(_ => res.sendStatus(200))
    .catch(err => errorHandler(err, res));
});

router.post("/downloadPrediction", (req, res) => {
  const id_token = req.body.id_token;
  const predictionID = req.body.predictionID;
  getUserId(id_token)
    .then(userToken => {
      return PredictionModel.findOne({user: userToken, _id: predictionID})
        .then(pred => JobModel.findOne({user: userToken, _id: pred.jobID}));
    })
    .then(trainJob => {
      const fileHash = trainJob.fileHash;
      // TODO
      res.sendStatus(200);
    })
    .catch(err => errorHandler(err, res));
});

module.exports = router;
