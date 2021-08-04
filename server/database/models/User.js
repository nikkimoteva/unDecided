const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  name: String,
  AWSAccessKey: String,
  AWSSecretKey: String,
});

module.exports = mongoose.model('user', userSchema);
