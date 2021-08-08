const express = require('express');
const JobModel = require("../database/models/Job");
const PredictionModel = require("../database/models/Prediction");
const router = express.Router();
const {trainPipeline, csvToArrays, makeid, runPredict, errorHandler, getUserId, connect, parseSqueue} = require("../Util");
const {storeCSV, removeCSV} = require("../FileManager");
const {borg_dataset_directory, slurm_command_dataset_path} = require('../../src/SecretHandler');
const {v4: uuidv4} = require('uuid');
const mongoose = require('mongoose');

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
  const {id_token, jobName, maxJobTime, targetColumnName, dataset, header} = req.body;
  const targetColumn = header.indexOf(targetColumnName);
  const _targetColumnName = targetColumnName.trim();

  const file_name = uuidv4();
  const train_path = borg_dataset_directory + file_name + "/train.csv";
  const local_path = "training/" + file_name + ".csv";
  const targetPath = slurm_command_dataset_path + file_name + '/' + 'train.csv';
  const callback = `https://ensemble-automl.herokuapp.com/api/jobs/bbmlCallback/${file_name}/training`;

  let trainString;

  // if (jobName.length === 0) jobName = "auto generated nickname";
  storeCSV(dataset, local_path)
    .then(() => getUserId(id_token))
    .then(user_email => {
      trainString = trainPipeline(targetPath, _targetColumnName, user_email, file_name, maxJobTime, jobName, callback);
      console.log(trainString);
    })
    .then(() => connect())
    .then(borg => {
      console.log("Success connecting to borg");
      return borg.putFile(local_path, train_path)
        .then(() => borg.exec(trainString, []))
        .then(stdOut => {
          const job = new JobModel({
            name: jobName,
            user: id_token,
            fileHash: file_name,
            target_name: _targetColumnName,
            target_column: targetColumn,
            timer: maxJobTime,
            headers: header,
            created: Date(),
            job_id: stdOut.slice(stdOut.length - 6, stdOut.length).trim()
          });
          console.log(job.job_id);
          return job.save();
        });
    })
    .then(() => removeCSV(local_path))
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
      const trainJobID = mongoose.Types.ObjectId(jobID);
      return JobModel.findById(trainJobID);
    })
    .then(job => {
      if (job === null) throw new Error('Associated training job not found');
      // if (!(job.headers.includes(job.target_name))) { // gotta push the target column into the file!
      //   const a = job.headers;
      //   a.push(job.target_name);
      //   data[0] = testColumns;
      //   const newFile = csv.fromArrays(data);
      //
      const folder_path = slurm_command_dataset_path + job.fileHash;
      const test_path = folder_path + '/' + test_file_name + '.csv';
      const local_path = `predictions/${job.fileHash}.csv`;
      const callback = `https://ensemble-automl.herokuapp.com/api/bbmlCallback/${job.fileHash}/prediction`;
      const predictString = runPredict(test_path, job.fileHash, job.timer, job.target_name, email, job.name, callback);

      return storeCSV(dataset, local_path)
        .then(() => connect())
        .then(borg => {
          console.log(predictString);
            return borg.putFile(local_path, test_path)
              .then(() => borg.exec(predictString, []));
          })
        .then(() => removeCSV(local_path));
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
  const localPath = "predictions/predictionFile.csv";
  getUserId(id_token)
    .then(userToken => {
      return PredictionModel.findOne({user: userToken, _id: predictionID})
        .then(pred => JobModel.findOne({user: userToken, _id: pred.jobID}));
    })
    .then(trainJob => {
      const fileHash = trainJob.fileHash;
      const timer = trainJob.timer;
      const seed = 0;
      const remotePath = `${slurm_command_dataset_path}../sessions/${fileHash}/ensemble/t${timer}_s${seed}/voting/full_ensemblesquared.csv`;
      console.log(remotePath);
      return connect()
        .then(borg => borg.getFile(localPath, remotePath))
        .then(() => console.log("Successfully downloaded prediction file"))
        .catch(() => res.error());
    })
    .then(() => res.download(localPath))
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

router.patch('/bbmlCallback/:jobID/:type', (req, res) => {
  console.log(req.body);
  const jobID = req.params.jobID;
  const type = req.params.type;
  const newStatus = (req.body.isSuccess) ? "Successful" : "Failed";
  if (type === "training") {
    JobModel.updateOne({_id: jobID}, {status: newStatus});
  } else if (type === "prediction") {
    PredictionModel.updateOne({jobID: jobID}, {status: newStatus});
  } else {
    res.error();
  }
  res.end();
});

router.post('/allJobs', async (req, res) => {
  const id_token = req.userID;
  const jobIDs = await JobModel.find({
    $or: [
      {status: "Queued"},
      {status: "Running"}
    ],
    // user: id_token
  }, {job_id: 1});

  const borg = await connect();
  for (const jobID of jobIDs) {
    const currJobID = jobID.job_id;
    const msg = await borg.execCommand(`/opt/slurm/bin/squeue -j ${currJobID}`);
    const job_status = parseSqueue(msg.stdOut, currJobID).status;

    if (job_status === 'R' && jobID.status === "Queued") {
      JobModel.updateOne({job_id: currJobID}, {status: "Running"});
    }
    if (job_status === "done") {
      JobModel.updateOne({job_id: currJobID}, {status: "Successful"});
    }
  }
  res.status(200);
});

router.get('/isJobDone', (req, res) => {
  const jobID = req.body.jobID;

  connect()
    .then(borg => {
      return borg.exec('/opt/slurm/bin/squeue -j ' + String(jobID), []);
    })
    .then(stdOut => {
      const time_status_json = parseSqueue(stdOut, jobID);
      res.send(time_status_json);
    })
    .catch(err => {
      errorHandler(err);
    });
});

module.exports = router;
