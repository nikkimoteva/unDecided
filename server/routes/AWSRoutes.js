const express = require('express');
const router = express.Router();
const {
  ListBucketsCommand,
  ListObjectsCommand,
  GetObjectCommand,
  S3Client
} = require("@aws-sdk/client-s3");
const {errorHandler} = require("../Util");

let awsClient = null;

router.post('/register', (req, res) => {
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

router.get('/listBuckets', (req, res) => {
  if (awsClient === null) res.sendStatus(401);
  awsClient.send(new ListBucketsCommand({}))
    .then(awsRes => res.json(awsRes))
    .catch(err => errorHandler(err, res));
});

router.post('/listObjects', (req, res) => {
  if (awsClient === null) res.sendStatus(401);
  const bucketName = req.body.bucketName;
  awsClient.send(new ListObjectsCommand({ Bucket: bucketName }))
    .then(awsRes => res.send(awsRes.Contents))
    .catch(err => errorHandler(err, res));
});

router.post('/getObject', (req, res) => {
  const key = req.body.key;
  if (awsClient === null) errorHandler("You must register your AWS credentials first", res);
  else if (key.slice(-4) !== ".csv") errorHandler("File name must end in .csv", res);
  else {
    const bucketName = req.body.bucketName;
    awsClient.send(new GetObjectCommand({
      Bucket: bucketName,
      Key: key
    }))
      .then(awsRes => {
        res.set('Content-Type', 'text/plain');
        awsRes.Body.pipe(res);
      })
      .catch(err => errorHandler(err, res));
  }
});

module.exports = router;
