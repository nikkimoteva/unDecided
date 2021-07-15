const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  targetCol: Number,
  targetName: String,
  status: {
    type: String,
    default: "Running"
  },
  maxJobTime: {
    type: Number,
    default: 10
  },
  created: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('job', jobSchema);
