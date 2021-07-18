const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: String,
  userName: {
    type: String,
    required: true
  },
  email: String,
  picture: String
});

module.exports = mongoose.model('user', userSchema);
