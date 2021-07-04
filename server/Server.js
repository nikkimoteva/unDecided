// const auth = require("./Auth.js");

const {ListBucketsCommand, ListObjectsCommand, GetObjectCommand, S3Client} = require("@aws-sdk/client-s3");
const {storeCSV} = require("./FileManager");
const path = require('path');

const auth = require("./Auth.js");
const express = require('express');
const app = express();
const cors = require('cors');
const logger = require('morgan');
const port = 3001;

let awsClient = null;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(logger('dev'));

app.get("/test", (req, res) => {
  res.sendStatus(200);
});

function streamToString (stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

app.get("/jobs", (req, res) => {
  const userToken = req.body.id_token;
  //todo: retrieve jobs given user token
  // res.json(/*jobs*/);
  res.sendStatus(200);
});

app.post("/gauth", (req, res) => {
  const success = auth.verifyAuth(req);
  const responseCode = (success) ? 200 : 400;
  res.sendStatus(responseCode);
});

app.post("/submitJob", (req, res) => {
  const body = req.body;
  const jobName = body.jobName;
  const maxJobTime = body.maxJobTime;
  const dataset = body.dataset;
  // TODO: Store job in db and start it up
  res.sendStatus(200);
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
  awsClient.send(new ListObjectsCommand({Bucket: bucketName}))
    .then(awsRes => res.send(awsRes.Contents))
    .catch(err => errorHandler(err, res));
});

app.post('/getObject', (req, res) => {
  if (awsClient === null) res.sendStatus(401);
  const bucketName = req.body.bucketName;
  const key = req.body.key;
  const csvFilePath = `./temp/${key}`;
  console.log(csvFilePath);

  awsClient.send(new GetObjectCommand({
    Bucket: bucketName,
    Key: key
  }))
    .then(awsRes => streamToString(awsRes.Body))
    .then(csvString => storeCSV(csvString, csvFilePath))
    .then(() => res.sendFile(path.resolve(csvFilePath)))
    .catch(err => errorHandler(err, res));
});

function errorHandler(err, res) {
  console.log(err);
  res.status(400);
  res.send(err);
}

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
