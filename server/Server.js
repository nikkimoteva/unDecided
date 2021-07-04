const auth = require("./Auth.js");
const express = require('express');
const app = express();
const cors = require('cors');
const logger = require('morgan');
const port = 3001;

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

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
