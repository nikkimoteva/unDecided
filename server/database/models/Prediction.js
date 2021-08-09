const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  jobID:{
    type: String,
    required: true,
    unique: true
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
    enum: ['Queued', 'Running', 'Successful', 'Failed'],
    default: "Queued"
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

module.exports = mongoose.model('prediction', predictionSchema);
