const express = require('express');
const router = express.Router();
const {errorHandler} = require("../Util");
const UserModel = require("../database/models/User");
const auth = require("../UserAuth/Auth");
const UserAuth = require("../UserAuth/UserAuth");
const {getUserId} = require("../Util");

router.post("/", (req, res) => {
  return UserAuth.validatePassword(req.body.email, req.body.password)
    .then((userData) => {
      if (!userData) {
        return res.sendStatus(400);
      } else {
        return res.send(userData);
      }
    })
    .catch(err => errorHandler(err, res));
});

router.post("/gauth", (req, res) => {
  auth.verifyAuth(req)
    .then(userData => res.send(userData))
    .catch(err => errorHandler(err, res));
});

router.get("/profile", (req, res) => {
  const id_token = req.body.id;
  getUserId(id_token)
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

router.post("/addUser", (req, res) => {
  UserAuth.addUser(req.body.name, req.body.email, req.body.password)
    .then((result) => {
      console.log(result);
      if (result === null) {
        return res.sendStatus(400);
      } else if (!result){
        return res.send({error: "Email already exists! Please login."});
      } else {
        return res.sendStatus(200);
      }
    })
    .catch(err => {
      console.log(err);
      errorHandler(err, res);
    });
});

router.post("/addAWSCred", (req, res) => {
  return UserAuth.addAWSCred(req.body.email, req.body.accessKey, req.body.secretKey)
  .then ((result) => {
    console.log(result);
    if (result === null) {
      console.log("Internal Error");
      return res.sendStatus(500);
    } else if (!result) {
      return res.sendStatus(400);
    } else {
      return res.sendStatus(200);
    }
  })
  .catch(err => {
    console.log(err);
    errorHandler(err, res);
  });
});

router.post("/getAWSCred", (req, res) => {
  return UserAuth.getAWSCred(req.body.email)
  .then ((result) => {
    if (result === null) {
      console.log("AWSCred is not yet set.");
      return res.send(null);
    } else {
      return res.send(result);
    }
  })
  .catch(err => {
    console.log(err);
    errorHandler(err, res);
  });
});

module.exports = router;
