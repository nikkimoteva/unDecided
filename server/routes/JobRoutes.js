const express = require('express');
const JobModel = require("../database/models/Job");
const PredictionModel = require("../database/models/Prediction");
const router = express.Router();
const {trainPipeline, makeid, runPredict, errorHandler, getUserId, connect, parseSqueue} = require("../Util");
const {email} = require("../SecretHandler");
const {storeCSV, removeCSV} = require("../FileManager");
const {borg_dataset_directory, slurm_command_dataset_path} = require('../SecretHandler');
const {v4: uuidv4} = require('uuid');
const mongoose = require('mongoose');
const {sendEmail} = require("../Util");

async function updateModel(model, jobsToUpdate) {
  if (jobsToUpdate.length !== 0) {
    const borg = await connect();
    for (const job of jobsToUpdate) {
      // Prediction jobs need to get file hash from associated training job
      const trainJob = (model === PredictionModel) ? await JobModel.findOne({_id: mongoose.Types.ObjectId(job.jobID)}).exec() : job;
      const currName = trainJob.fileHash;
      const msg = await borg.execCommand(`/opt/slurm/bin/squeue -n ${currName}`);
      const squeueOut = parseSqueue(msg.stdout, currName);

      if (squeueOut === null) continue;
      const newStatus = (squeueOut.status === 'R') ? "Running" : "Queued";
      console.log(`${currName}: ${newStatus}`);
      await model.updateOne({_id: job._id}, {status: newStatus, time_elapsed: squeueOut.time_elapsed});
    }
  }
}

router.post("/", async (req, res) => {
  const user_token = await getUserId(req.body.id_token);
  const jobsToUpdate = await JobModel.find({
    $or: [
      {status: "Queued"},
      {status: "Running"}
    ],
    user: user_token
  });

  await updateModel(JobModel, jobsToUpdate);
  const jobs = await JobModel.find({user: user_token});
  res.json(jobs);
});

router.post("/job", async (req, res) => {
  const id_token = req.body.id_token;
  const jobID = req.body.jobID;
  const jobsToUpdate = await JobModel.find({user: id_token, _id: jobID});
  await updateModel(JobModel, jobsToUpdate);
  const job = await JobModel.find({user: id_token, _id: jobID});
  res.json(job);
});

router.delete("/deleteJob", (req, res) => {
  const id_token = req.body.id_token;
  const jobId = req.body.jobId;
  getUserId(id_token)
    .then(userToken => JobModel.deleteOne({user: userToken, _id: jobId}))
    .then(() => res.sendStatus(200))
    .catch(err => errorHandler(err, res));
});


router.post("/submitTrainJob", (req, res) => {
  const {id_token, jobName, maxJobTime, targetColumnName, dataset, header} = req.body;
  const targetColumn = header.indexOf(targetColumnName);

  const file_name = uuidv4();
  const train_path = borg_dataset_directory + file_name + "/train.csv";
  const local_path = "training/" + file_name + ".csv";
  const targetPath = slurm_command_dataset_path + file_name + '/' + 'train.csv';
  const callback = `https://ensemble-automl.herokuapp.com/api/jobs/bbmlCallback/${file_name}/training`;

  let trainString;

  storeCSV(dataset, local_path)
    .then(() => getUserId(id_token))
    .then(user_email => {
      const sanitizedJobName = jobName.replace(/[^a-zA-Z ]/g, "");
      trainString = trainPipeline(targetPath, targetColumnName, user_email, file_name, maxJobTime, sanitizedJobName, callback);
      console.log(trainString);
    })
    .then(() => connect())
    .then(borg => {
      console.log("Success connecting to borg");
      return borg.putFile(local_path, train_path)
        .then(() => borg.exec(trainString, []))
        .then(() => {
          const job = new JobModel({
            name: jobName,
            user: id_token,
            fileHash: file_name,
            target_name: targetColumnName,
            target_column: targetColumn,
            timer: maxJobTime,
            headers: header,
          });
          return job.save();
        });
    })
    .then(() => removeCSV(local_path))
    .then(msg => res.send({borg_stdout: msg, fileHash: file_name}))
    .catch(err => errorHandler(err, res));
});

router.post("/predictions", async (req, res) => {
  const id_token = req.body.id_token;
  const trainJobID = req.body.jobID;
  const user_token = await getUserId(id_token);

  const jobsToUpdate = await PredictionModel.find({
    $or: [
      {status: "Queued"},
      {status: "Running"}
    ],
    user: user_token,
    jobID: trainJobID
  });

  await updateModel(PredictionModel, jobsToUpdate);
  const predictions = await PredictionModel.find({user: id_token, jobID: trainJobID});
  res.json(predictions);
});

router.post("/submitPrediction", async (req, res) => {
  const {id_token, predictionName, jobID, dataset} = req.body;
  const test_file_name = makeid(4);
  const user_email = await getUserId(id_token);
  const trainJobID = mongoose.Types.ObjectId(jobID);
  const trainJob = await JobModel.findById(trainJobID).exec();

  const prediction = new PredictionModel({
    name: predictionName,
    user: id_token,
    jobID: jobID
  });

  if (trainJob === null) throw new Error('Associated training job not found');

  const folder_path = slurm_command_dataset_path + trainJob.fileHash;
  const test_path = folder_path + '/' + test_file_name + '.csv';
  const local_path = `predictions/${trainJob.fileHash}.csv`;
  const predJob = await prediction.save();
  const _id = predJob._id.toString();

  const callback = `https://ensemble-automl.herokuapp.com/api/jobs/bbmlCallback/${_id}/prediction`;
  const predictString = runPredict(test_path, trainJob.fileHash, trainJob.timer, trainJob.target_name, user_email, trainJob.name, callback);
  await storeCSV(dataset, local_path);
  const borg = await connect();
  await borg.putFile(local_path, test_path);
  console.log(predictString);
  await borg.exec(predictString, []);
  await removeCSV(local_path);
  res.sendStatus(200);
});

router.delete("/deletePrediction", (req, res) => {
  const id_token = req.body.id_token;
  const predictionID = req.body.predictionID;
  getUserId(id_token)
    .then(userToken => PredictionModel.deleteOne({user: userToken, _id: predictionID}))
    .then(() => res.sendStatus(200))
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
        .then(borg => {
          console.log("Connected to borg");
          return borg.getFile(localPath, remotePath);
        })
        .then(() => console.log("Successfully downloaded prediction file"))
        .catch(() => res.sendStatus(404));
    })
    .then(() => res.download(localPath, () => removeCSV(localPath)))
    .catch(err => errorHandler(err, res));
});

router.delete("/deletePredictionJobID", (req, res) => {
  const id_token = req.body.id_token;
  const jobID = req.body.jobID;
  console.log(jobID);
  getUserId(id_token)
    .then(userId => PredictionModel.deleteOne({user: userId, jobID: jobID}))
    .then(() => res.sendStatus(200))
    .catch(err => errorHandler(err, res));
});

async function getUserEmail(jobID, jobType) {
  if (jobType === "training") {
    const trainingJob = await JobModel.findOne({fileHash: jobID}).exec();
    return trainingJob.user;
  } else if (jobType === "prediction") {
    const predictionJob = await PredictionModel.findOne({_id: mongoose.Types.ObjectId(jobID)}).exec();
    return predictionJob.user;
  } else {
    console.error(`Invalid type given: ${jobType}`);
    return Promise.resolve();
  }
}

router.patch('/bbmlCallback/:jobID/:type', async (req, res, next) => {
  console.log("bbmlCallback called");
  const jobID = req.params.jobID;
  const type = req.params.type;
  const newStatus = (req.body.isSuccess) ? "Successful" : "Failed";
  const user_email = await getUserEmail(jobID, type);
  const info = {
    fromEmail: email,
    toEmail: user_email,
  };
  if (type === "training") {
    JobModel.updateOne({fileHash: jobID}, {status: newStatus}) // if training, ID is fileHash
      .then(() => {
        const subject = (req.body.isSuccess) ? "Your training job is complete" : "Your training job has failed";
        info.subject = `Ensemble AutoML - ${subject}`;
        info.message = (req.body.isSuccess)
        ? `A training job you recently submitted has successfully completed. Please go to https://ensemble-automl.herokuapp.com/console to submit a prediction.`
          : `A training job you recently submitted has failed. Please try restarting the job at https://ensemble-automl.herokuapp.com/console or reply to this email to submit a ticket.`;
        return sendEmail(info);
      })
      .then(() => res.end())
      .catch(next);
  } else if (type === "prediction") {
    PredictionModel.updateOne({_id: mongoose.Types.ObjectId(jobID)}, {status: newStatus}) // otherwise, ID is _id of prediction job
      .then(() => {
        const subject = (req.body.isSuccess) ? "Your Prediction job is complete" : "Your Prediction job has failed";
        info.subject = `Ensemble AutoML - ${subject}`;
        info.message = (req.body.isSuccess)
          ? `A prediction job you recently submitted has successfully completed. Please go to https://ensemble-automl.herokuapp.com/console to download your prediction.`
          : `A prediction job you recently submitted has failed. Please try restarting the job at https://ensemble-automl.herokuapp.com/console or reply to this email to submit a ticket.`;
        return sendEmail(info);
      })
      .then(() => res.end())
      .catch(next);
  } else {
    console.error(`Invalid type given: ${type}`);
  }
});

module.exports = router;
