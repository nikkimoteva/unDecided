// const auth = require("./Auth.js");

const {ListBucketsCommand, ListObjectsCommand, GetObjectCommand, S3Client} = require("@aws-sdk/client-s3");
const {fromCognitoIdentityPool} = require("@aws-sdk/credential-provider-cognito-identity");
const {CognitoIdentityClient} = require("@aws-sdk/client-cognito-identity");
const {storeCSV} = require("./FileManager");

const express = require('express');
const app = express();
const cors = require('cors');
const logger = require('morgan');
const axios = require('axios');
const port = 3001;

let awsClient;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(logger('dev'));

app.get("/test", (req, res) => {
  res.sendStatus(200);
});

app.get("/jobs", (req, res) => {
  const userToken = req.body.id_token;
  //todo: retrieve jobs given user token
  // res.json(/*jobs*/);
  res.sendStatus(200);
});

app.post("/gauth", (req, res) => {
  const userToken = req.body.id_token;
  // not really needed unless we go into actual production.
  // verify(userToken)
  //   .then((userId) => {
  //     const profile = req.body.profile;
  //     const name = profile.name;
  //     const imageUrl = profile.imageUrl;
  //     const email = profile.email; // This is null if the 'email' scope is not present.
  //     // TODO store profile information in db
  //
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.sendStatus(401);
  //   })
  axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${userToken}`)
    .then(axiosRes => {
      if (axiosRes.status !== 200) throw new Error();
      const body = axiosRes.data;
      const name = body.name;
      const picture = body.picture;
      const email = body.email;
      // TODO store profile information in db
      res.sendStatus(200);
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(401);
    });
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
  try {
    const identityPoolId = req.body.identityPoolId;
    const region = identityPoolId.split(":")[0];
    awsClient = new S3Client({
      region,
      credentials: fromCognitoIdentityPool({
        client: new CognitoIdentityClient({region}),
        identityPoolId: identityPoolId,
      })
    });
    res.sendStatus(200);
  } catch (err) {
    console.log(`Error: ${err}`);
    res.sendStatus(400);
  }
});

app.get('/listBuckets', (req, res) => {
  awsClient.send(new ListBucketsCommand({}))
    .then(awsRes => {
      res.json(awsRes.Buckets);
    })
    .catch(err => {
      res.send(err);
    });
});

app.post('/listObjects', (req, res) => {
  const bucketName = req.body.bucketName;
  awsClient.send(new ListObjectsCommand({Bucket: bucketName}))
    .then(awsRes => {
      res.send(awsRes.Contents);
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
});

app.post('/getObject', (req, res) => {
  const bucketName = req.body.bucketName;
  const key = req.body.key;
  const csvFilePath = `./temp/${key}`;

  awsClient.send(new GetObjectCommand({
    Bucket: bucketName,
    Key: key
  }))
    .then(awsRes => {
      const streamToString = (stream) =>
        new Promise((resolve, reject) => {
          const chunks = [];
          stream.on("data", (chunk) => chunks.push(chunk));
          stream.on("error", reject);
          stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
        });
      return streamToString(awsRes.Body);
    })
    .then(csvString => {
      return storeCSV(csvString, csvFilePath);
    })
    .then(() => {
      res.sendFile(csvFilePath);
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400);
    });
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
