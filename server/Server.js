const {
  ListBucketsCommand,
  ListObjectsCommand,
  GetObjectCommand,
  S3Client
} = require("@aws-sdk/client-s3");
const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const logger = require('morgan');

const { storeCSV } = require("./FileManager");
const auth = require("./Auth.js");
const JobModel = require("./database/models/Job");
const UserModel = require("./database/models/User");
const csv = require('jquery-csv');
const { v4: uuidv4 } = require('uuid');


const { NodeSSH } = require('node-ssh');
const user = 'blkbx-ml';
const password = '1qaz2wsx';

const { readFilePromise, csvToArrays, csvToObject, arraysToCsv, runPredict, trainPipeline, forwardOutPromise } = require("./Util");
require("./database/Database"); // Initializes DB connection

const port = 3001;
let awsClient = null;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(logger('dev'));

app.get("/test", (req, res) => {
  res.sendStatus(200);
});

app.post("/jobs", (req, res) => {
  const id_token = req.body.id_token;
  JobModel.find({ user: id_token })
    .then(jobs => {
      return res.json(jobs);
    })

    .catch(err => errorHandler(err, res));
});

app.delete("/deleteJob", (req, res) => {
  const id_token = req.body.id_token;
  const jobId = req.body.jobId;
  auth.getUserId(id_token)
    .then(_ => JobModel.deleteOne({ _id: jobId })
      .then(_ => res.sendStatus(200)))
    .catch(err => errorHandler(err, res));
});

app.post("/gauth", (req, res) => {
  auth.verifyAuth(req)
    .then(userData => res.send(userData))
    .catch(err => errorHandler(err, res));
});

app.get("/profile", (req, res) => {
  const id_token = req.body.id;
  auth.getUserId(id_token)
    .then(userId => {
      // TODO: Implement getUserId
      return UserModel.find({
        _id: userId
      });
    })
    .then(users => {
      const user = users[0];
      res.json({ userName: user.userName, email: user.email, picture: user.picture });
    })
    .catch(err => errorHandler(err, res));
});

app.post("/submitJob", (req, res) => {
  const body = req.body;
  const id_token = body.id_token;
  const jobName = body.jobName;
  const maxJobTime = body.maxJobTime;
  const targetCol = body.targetCol;
  const targetColName = body.targetColName;
  const dataset = body.dataset;
  const job = new JobModel({
    name: jobName,
    user: id_token,
    target_column: targetCol,
    target_name: targetColName,
    timer: maxJobTime,
  });
  job.save()
    .then(_ => {
      return res.sendStatus(200);
    })
    .catch(err => errorHandler(err, res));
});

app.post('/registerAWS', (req, res) => {
  const region = req.body.region;
  const creds = req.body.credentials;
  try {
    awsClient = new S3Client({
      region: region,
      credentials: creds
    });
    res.sendStatus(200);
  } catch (err) {
    errorHandler(err, res);
  }
});

app.get('/listBuckets', (req, res) => {
  if (awsClient === null) res.sendStatus(401);
  awsClient.send(new ListBucketsCommand({}))
    .then(awsRes => res.json(awsRes))
    .catch(err => errorHandler(err, res));
});

app.post('/listObjects', (req, res) => {
  if (awsClient === null) res.sendStatus(401);
  const bucketName = req.body.bucketName;
  awsClient.send(new ListObjectsCommand({ Bucket: bucketName }))
    .then(awsRes => res.send(awsRes.Contents))
    .catch(err => errorHandler(err, res));
});

app.post('/getObject', (req, res) => {
  if (awsClient === null) res.sendStatus(401);
  const bucketName = req.body.bucketName;
  const key = req.body.key;
  const csvFilePath = `temp/${key}`;

  awsClient.send(new GetObjectCommand({
    Bucket: bucketName,
    Key: key
  }))
    .then(awsRes => streamToString(awsRes.Body))
    .then(csvString => storeCSV(csvString, csvFilePath)) // TODO store in DB
    .then(() => res.sendFile(path.resolve(csvFilePath)))
    .catch(err => errorHandler(err, res));
});

app.post('/tableView', (req, res) => {
  const user_email = req.body.email;
  const target_name = req.body.target;
  const search_time = req.body.maxJobTime;
  let nickname = req.body.nickName;

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
      const file_name = req.body.fileHash;
      const train_path = '../../../research/plai-scratch/BlackBoxML/bbml-backend-3/ensemble_squared/datasets' + file_name + '.csv';
      const local_path = './' + file_name;

      ssh2.putFile(local_path, train_path).then(() => 
        readFilePromise(local_path)
      ).then(fileContent => {
        const fileArray = csv.toArrays(fileContent);
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
          const trainString = trainPipeline(train_path, target_name, user_email, file_name, search_time, nickname);
          ssh2.exec(trainString, [])
          .then(() => 
            res.status(200)
          );
        } catch (err) {
          errorHandler(err);
        }
      });
    })
    .catch(err => {
      console.log(err);
    });
  });

app.post('/pipeline', (req, res) => {
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

function streamToString(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

function errorHandler(err, res) {
  console.log(err);
  res.status(400);
  res.send(err);
}

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
