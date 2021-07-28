const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const logger = require('morgan');

require("./database/Database"); // Initializes DB connection

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(logger('dev'));

const api = require('./routes/api');
app.use('/api', api);

app.use(express.static(path.join(__dirname, '../build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
