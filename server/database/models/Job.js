const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  user: { // keep
    type: String,
    required: true
  },
  dataset: { // keep
    type: Array,
    required: true
  },
  fileHash: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  headers:{
    type: Array,
    required: true
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
  }
});

module.exports = mongoose.model('job', jobSchema);
