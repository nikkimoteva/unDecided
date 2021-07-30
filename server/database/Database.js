const mongoose = require('mongoose');
const {user, password, server, database} = require("../../src/SecretHandler");

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose.connect(`mongodb+srv://${user}:${password}@${server}/${database}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
      .then(() => {
        console.log('Database connection successful');
      })
      .catch(err => {
        console.error(err);
      });
  }
}

module.exports = new Database();
