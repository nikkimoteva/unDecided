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
  const userToken = req.body.userToken;
  //todo: retrieve jobs given user token
  res.json(/*jobs*/);
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
});
