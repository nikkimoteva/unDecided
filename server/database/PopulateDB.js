require("./Database");
const JobModel = require("./models/Job");
const UserModel = require("./models/User");

const users = [
  {
    _id: "testUser1",
    userName: "KianShah",
    email: "kianshah376@gmail.com"
  },
  {
    _id: "testUser2",
    userName: "blackboxML",
    email: "eautoml@gmail.com"
  }
];

const jobs = [
  {
    name: "Job 1",
    user: "testUser1",
    targetCol: "6",
    targetName: "gender",
    maxJobTime: 60
  },
  {
    name: "Job 2",
    user: "testUser2",
    targetCol: "15",
    targetName: "ripeness(0-4)",
    status: "Finished",
    maxJobTime: 30
  },
  {
    name: "Job 3",
    user: "testUser2",
    targetCol: "0",
    targetName: "temp (C)",
  },
  {
    name: "Job 4",
    user: "testUser2",
    targetCol: "25",
    targetName: "Income ($/year)"
  },
  {
    name: "Job 5",
    user: "testUser1",
    targetCol: "0",
    targetName: "Temp (F)",
    status: "Waiting"
  },
  {
    name: "Job 6",
    user: "testUser1",
    targetCol: "0",
    targetName: "isAvailable",
    maxJobTime: 5
  },
  {
    name: "Job 7",
    user: "testUser1",
    targetCol: "55",
    targetName: "isHuman"
  }
];

UserModel.insertMany(users, {ordered: false})
  .then(_ => JobModel.insertMany(jobs, {ordered: false}))
  .then(_ => JobModel.find({user: "testUser1"}, '_id'))
  .then(ids => UserModel.updateOne({_id: "testUser1"}, {jobIDs: ids}))
  .then(_ => JobModel.find({user: "testUser2"}, '_id'))
  .then(ids => UserModel.updateOne({_id: "testUser2"}, {jobIDs: ids}))
  .then(_ => {console.log("Successfully inserted dummy values"); process.exit(0)})
  .catch(err => {console.log(err); process.exit(1);});
