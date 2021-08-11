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
    required: true
  },
  status: {
    type: String,
    enum: ['Queued', 'Running', 'Successful', 'Failed'],
    default: "Queued"
  },
  headers:{
    type: Array,
    required: true
  },
  target_name: {
    type: String,
    required: true
  },
  timer: {
    type: Number,
    default: 10
  },
  target_column: {
    type: Number,
    required: true
  },
  created: {
    type: Date,
    default: Date.now()
  },
  time_elapsed: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('job', jobSchema);
