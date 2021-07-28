const express = require('express');
const router = express.Router();
const {errorHandler} = require("../Util");
const UserModel = require("../database/models/User");
const auth = require("../Auth");
const {getUserId} = require("../Util");

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

module.exports = router;
