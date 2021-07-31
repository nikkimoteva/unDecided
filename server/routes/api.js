const express = require('express');
const router = express.Router();

const JobModel = require("../database/models/Job");
const csv = require('jquery-csv');
const { storeCSV } = require("../FileManager");
const { makeid } = require("../Util");
const {NodeSSH} = require("node-ssh");
const { readFilePromise, csvToArrays, csvToObject, arraysToCsv, runPredict, trainPipeline, forwardOutPromise, errorHandler} = require("../Util");

const aws = require("./AWSRoutes");
const jobs = require("./JobRoutes");
const auth = require("./AuthRoutes");
const { ssh_user, remote_ssh, ssh_pw, slurm_command_dataset_path } = require('../../src/SecretHandler.js');
router.use('/auth', auth);
router.use('/jobs', jobs);
router.use('/aws', aws);

router.get("/test", (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
