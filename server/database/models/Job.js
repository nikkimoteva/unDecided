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
  maxJobTime: { // keep
    type: Number,
    default: 10
  },
  dataset: { // keep
    type: Array,
    required: true
  }
});

module.exports = mongoose.model('job', jobSchema);
