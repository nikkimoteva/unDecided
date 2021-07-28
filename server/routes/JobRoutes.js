const express = require('express');
const JobModel = require("../database/models/Job");
const router = express.Router();
const {errorHandler} = require("../Util");
const {getUserId} = require("../Util");
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
    .then(_ => JobModel.deleteOne({ _id: jobId })
      .then(_ => res.sendStatus(200)))
    .catch(err => errorHandler(err, res));
});


router.post("/submitJob", (req, res) => {
  const body = req.body;
  const id_token = body.id_token;
  const jobName = body.jobName;
  const maxJobTime = body.maxJobTime;
  const targetColumnName = body.targetColumnName;
  const dataset = body.dataset;
  const job = new JobModel({
    name: jobName,
    user: id_token,
    target_column: targetColumn,
    target_name: targetColumnName,
    timer: maxJobTime,
  });
  job.save()
    .then(_ => {
      return res.sendStatus(200);
    })
    .catch(err => errorHandler(err, res));
});

module.exports = router;
