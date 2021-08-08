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
    // required: true // TODO: Should we make this required
  },
  status: {
    type: String,
    enum: ['Queued', 'Running', 'Successful', 'Failed'],
    default: "Queued"
  },
  headers:{
    type: Array,
    // required: true // TODO make required
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
    default : 0 // TODO: IS this a good idea
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
