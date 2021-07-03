const { writeFileSync } = require('fs');
const rootDir = ".";

function storeCSV(csvString, path) {
  const pathToFile = `${rootDir}/${path}`;
  console.log(`Saving downloaded csv to ${pathToFile}`);
  writeFileSync(pathToFile, csvString);
}

exports.storeCSV = storeCSV;
