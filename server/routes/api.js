const express = require('express');
const router = express.Router();

const aws = require("./AWSRoutes");
const jobs = require("./JobRoutes");
const auth = require("./AuthRoutes");
const {errorHandler} = require("../Util");
const {sendEmail} = require("../Util");
const {email} = require("../SecretHandler");
router.use('/auth', auth);
router.use('/jobs', jobs);
router.use('/aws', aws);

router.get("/test", (req, res) => {
  res.sendStatus(200);
});

router.post("/contactus", (req, res) => {
  const toSend = req.body.toSend;
  const info = {
    fromEmail: email,
    toEmail: email,
    subject: `Email from ${toSend.email}: ${toSend.subject}`,
    message: toSend.message
  };

  sendEmail(info)
    .then(emailRes => res.send(emailRes))
    .catch(err => errorHandler(err, res));
});

module.exports = router;
