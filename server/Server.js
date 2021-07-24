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
const auth = require("./UserAuth/Auth.js");
const UserAuth = require("./UserAuth/UserAuth.js");
const JobModel = require("./database/models/Job");
const UserModel = require("./database/models/User");
const csv = require('jquery-csv');

const { readFilePromise, csvToArrays, csvToObject, arraysToCsv, runPredict, trainPipeline } = require("./Util");
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
  JobModel.find({user: id_token})
    .then(jobs =>{
      return res.json(jobs);
    })

    .catch(err => errorHandler(err, res));
});

app.delete("/deleteJob", (req, res) => {
  const id_token = req.body.id_token;
  const jobId = req.body.jobId;
  auth.getUserId(id_token)
    .then(_ => JobModel.deleteOne({ _id: jobId }))
    .catch(err => errorHandler(err, res));
});

app.post("/gauth", (req, res) => {
  auth.verifyAuth(req)
    .then(userData => res.send(userData))
    .catch(err => errorHandler(err, res));
});

app.post("/auth", (req, res) => {
  UserAuth.validatePassword(req.body.email, req.body.password)
  .then((userData) => {
    console.log(!userData);
    if (!userData) {
      res.sendStatus(404);
    } else {
      res.send(userData);
    }
  })
  .catch(err => errorHandler(err, res));
});

app.post("/addUser", (req, res) => {
  UserAuth.addUser(req.body.name, req.body.email, req.body.password)
  .then((result) => {
    if (result) {
      // res.send([{error: "Email already exists. Please log in"}]);
      // return res.send(result);
      return [{error: "Email already exists. Please log in"}];
    } else {
      res.status(200).send("good");
    }
  })
  .catch(err => {
    console.log(err);
    errorHandler(err, res)});
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
  const file_name = req.body.fileHash;
  const train_path = './scratch/users_csv/' + file_name + '.csv';

  readFilePromise(train_path).then(fileContent => {
    const fileArray = csvToArrays(fileContent);
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
      trainPipeline();
      res.status(200);
    } catch (err) {
      errorHandler(err);
    }
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
    const test_file_name = makeid(4);
    const folder_path = './scratch/users_csv/' + search_id;
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

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
