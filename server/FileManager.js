const fs = require('fs');
const _fs = fs.promises;
const path = require('path');

function storeCSV(csvString, pathToFile) {
  console.log(`Saving downloaded csv to ${pathToFile}`);
  const parent = path.dirname(pathToFile);
  if (!fs.existsSync(parent)) {
    fs.mkdirSync(parent, {recursive: true});
  }
  return _fs.writeFile(pathToFile, csvString);
}

function removeCSV(path) {
  fs.unlinkSync(path);
}

exports.storeCSV = storeCSV;
exports.removeCSV = removeCSV;
