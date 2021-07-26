const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  name: String,
  salt: String,
  passwordHash: String,
});

module.exports = mongoose.model('user', userSchema);
