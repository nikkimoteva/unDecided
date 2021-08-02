const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  jobID:{
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: "Running"
  },
  created: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('prediction', predictionSchema);
