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
  maxJobTime: {
    type: Number,
    default: 10
  },
  dataset: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('job', jobSchema);
