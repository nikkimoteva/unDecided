// const auth = require("./Auth.js");

const express = require('express');
const app = express();
const cors = require('cors');
const logger = require('morgan');
const axios = require('axios');
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
  // res.json(/*jobs*/);
  res.sendStatus(200);
});

app.post("/gauth", (req, res) => {
  const userToken = req.body.id_token;
  console.log(userToken)

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
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
});
