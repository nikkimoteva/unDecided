
const csv = require('jquery-csv');
const fs = require('fs');

const sample = './example.csv';

function parseCSV(filePath) {
    fs.readFile(filePath, 'UTF-8', (err, fileContent) => {
        if (err) { console.log(err); }
        csv.toObjects(fileContent, {}, (err, data) => {
            if (err) { console.log(err); }
            return data;
        });
    });
}