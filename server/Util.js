
const csv = require('jquery-csv');
const fs = require('fs');

const user = 'blkbx-ml';
const password = '1qaz2wsx';

module.exports = {
    
    csvToArrays: function (fileContent) {
        return new Promise((resolve, reject) => {
            csv.toArrays(fileContent, {}, (err, data) => {
                if (err) {
                    reject(err); 
                }
                resolve(data);
            });
        });
    },

    csvToObject: function (fileContent) {
        return new Promise((resolve, reject) => {
            csv.toObjects(fileContent, {}, (err, data) => {
                if (err) {
                    reject(err); 
                }
                resolve(data);
            });
        });
    },

    arraysToCsv: function (arr) {
        return new Promise((resolve, reject) => {
            csv.fromArrays(arr, {}, (err, result) => {
                if (err) {
                    reject(err); 
                }
                resolve(result);
            });
        });
    },

    objectsToCsv: function (arr) {
        return new Promise((resolve, reject) => {
            csv.fromObjects(arr, {}, (err, result) => {
                if (err) {
                    reject(err); 
                }
                resolve(result);
            });
        });
    },

    readFilePromise: function (filePath) {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'UTF-8', (err, fileContent) => {
                if (err) {
                    reject(err); 
                }
                resolve(fileContent);
            });
        });
    },

    runPredict: function (csv_file_name, job_id, timer, target_name, email, job_name) {
       return "/opt/slurm/bin/sbatch --partition=blackboxml --nodelist=chicago\
       --error=/ubc/cs/research/plai-scratch/BlackBoxML/error_predict.err\
       --output=/ubc/cs/research/plai-scratch/BlackBoxML/out_predict.out\
       /ubc/cs/research/plai-scratch/BlackBoxML/bbml-backend-3/ensemble_squared/run-client-produce.sh "
        + job_id + " " + job_name + " " + csv_file_name + " " + timer + " " + target_name + " " + email;
    },

    trainPipeline: function (csv_file_name, target_name, email, job_id, timer, job_name) {
        return "/opt/slurm/bin/sbatch --partition=blackboxml --nodelist=chicago\
        --error=/ubc/cs/research/plai-scratch/BlackBoxML/error.err\
        --output=/ubc/cs/research/plai-scratch/BlackBoxML/out.out\
        /ubc/cs/research/plai-scratch/BlackBoxML/bbml-backend-3/ensemble_squared/run-client-search.sh " 
        + job_id + " " + job_name + " " + csv_file_name + " " + timer + " " + target_name + " " + email;
    },
    
    forwardOutPromise: function (conn1, conn2) {
        return new Promise(((resolve, reject) => {
          conn1.forwardOut('127.0.0.1', 22, '142.103.16.250', 22, (err, stream) => {
            if (err) {
              reject(err);
            }
            conn2.connect({
              sock: stream,
              username: user,
              password: password,
            })
              .then(() => resolve())
              .catch(err => reject(err));
          });
        }));
    },



};
