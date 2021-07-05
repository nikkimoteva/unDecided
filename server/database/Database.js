const mongoose = require('mongoose');

const user = 'blackboxAdmin';
const password = 'hz2PWdY3ZFaThSr';
const server = 'cluster0.lwfgf.mongodb.net';
const database = 'blackboxML';

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
