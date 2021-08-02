const express = require('express');
const router = express.Router();

const aws = require("./AWSRoutes");
const jobs = require("./JobRoutes");
const auth = require("./AuthRoutes");
router.use('/auth', auth);
router.use('/jobs', jobs);
router.use('/aws', aws);

router.get("/test", (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
