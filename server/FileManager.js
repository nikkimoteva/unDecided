const { writeFile } = require('fs').promises;
const rootDir = ".";

function storeCSV(csvString, path) {
  const pathToFile = `${path}`;
  console.log(`Saving downloaded csv to ${pathToFile}`);
  return writeFile(pathToFile, csvString);
}

exports.storeCSV = storeCSV;
