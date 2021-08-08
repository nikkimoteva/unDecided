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
  fileHash: {
    type: String,
    // required: true
  },
  status: { // One of ['Queued', 'Running', 'Successful', 'Failed']
    type: String,
    required: true,
    default: "Queued"
  },
  headers:{
    type: Array,
    // required: true
  },
  target_name: {
    type: String
  },
  timer: {
    type: Number,
    default: 10
  },
  target_column: {
    type: Number,
    default : 0
  },
  created: {
    type: Date,
    default: Date.now()
  },
  job_id: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('job', jobSchema);
