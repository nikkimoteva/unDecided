require("./Database");
const JobModel = require("./models/Job");
const UserModel = require("./models/User");

const users = [
  {
    _id: "kianshah376@gmail.com",
    userName: "KianShah",
    email: "kianshah376@gmail.com"
  },
  {
    _id: "eautoml@gmail.com",
    userName: "blackboxML",
    email: "eautoml@gmail.com"
  }
];

const jobs = [
  {
    name: "Job 1",
    user: "kianshah376@gmail.com",
    target_col: "6",
    target_name: "gender",
    maxJobTime: 60
  },
  {
    name: "Job 2",
    user: "eautoml@gmail.com",
    target_col: "15",
    target_name: "ripeness(0-4)",
    status: "Finished",
    maxJobTime: 30
  },
  {
    name: "Job 3",
    user: "eautoml@gmail.com",
    target_col: "0",
    target_name: "temp (C)",
  },
  {
    name: "Job 4",
    user: "eautoml@gmail.com",
    target_col: "25",
    target_name: "Income ($/year)"
  },
  {
    name: "Job 5",
    user: "kianshah376@gmail.com",
    target_col: "0",
    target_name: "Temp (F)",
    status: "Waiting"
  },
  {
    name: "Job 6",
    user: "kianshah376@gmail.com",
    target_col: "0",
    target_name: "isAvailable",
    maxJobTime: 5
  },
  {
    name: "Job 7",
    user: "kianshah376@gmail.com",
    target_col: "55",
    target_name: "isHuman"
  }
];

UserModel.insertMany(users, {ordered: false})
  .then(_ => JobModel.insertMany(jobs, {ordered: false}))
  .then(_ => {console.log("Successfully inserted dummy values"); process.exit(0);})
  .catch(err => {console.log(err); process.exit(1);});
