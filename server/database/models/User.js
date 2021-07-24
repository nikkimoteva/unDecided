const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  name: String,
  salt: String,
  passwordHash: String,
});

module.exports = mongoose.model('user', userSchema);
