const { writeFile } = require('fs').promises;
const rootDir = ".";

function storeCSV(csvString, path) {
  const pathToFile = `${rootDir}/${path}`;
  console.log(`Saving downloaded csv to ${pathToFile}`);
  return writeFile(pathToFile, csvString);
}

exports.storeCSV = storeCSV;
