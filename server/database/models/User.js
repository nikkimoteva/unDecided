const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: String,
  userName: {
    type: String,
    required: true
  },
  name: String,
  // emailSalt: String,
  // emailHash: String,
  salt: String,
  passwordHash: String,
  // picture: String
});

module.exports = mongoose.model('user', userSchema);
