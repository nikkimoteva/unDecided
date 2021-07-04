const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    lowercase: true
  },
  jobIDs: {
    type: Array,
    default: []
  }
});
