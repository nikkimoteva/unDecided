const csv = require('jquery-csv');
const fs = require('fs');
const { ssh_user, ssh_pw, ensemble_session_path, remote_ssh } = require('../src/SecretHandler');
const { NodeSSH } = require('node-ssh');

const ssh1 = new NodeSSH();
const ssh2 = new NodeSSH();

function forwardOutPromise(conn1, conn2) {
  return new Promise(((resolve, reject) => {
    conn1.forwardOut('127.0.0.1', 22, '142.103.16.250', 22, (err, stream) => {
      if (err) {
        reject(err);
      }
      conn2.connect({
        sock: stream,
        username: ssh_user,
        password: ssh_pw,
      })
        .then(() => resolve())
        .catch(err => reject(err));
    });
  }));
}

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

    runPredict: function (csv_file_name, job_id, timer, target_name, email, job_name, callback="") {
        return `/opt/slurm/bin/sbatch --partition=blackboxml --nodelist=chicago\
       --error=/ubc/cs/research/plai-scratch/BlackBoxML/error_predict_eml.err\
       --output=/ubc/cs/research/plai-scratch/BlackBoxML/out_predict_eml.out\
       /ubc/cs/research/plai-scratch/BlackBoxML/bbml-backend-3/ensemble_squared_2/ensemble_squared/run-client-produce-bm.sh\
        ${job_id} '${job_name}' ${csv_file_name} ${timer} '${target_name}' ${email} '${callback}'`;
    },

    trainPipeline: function (csv_file_name, target_name, email, job_id, timer, job_name, callback="") {
        return `/opt/slurm/bin/sbatch --partition=blackboxml --nodelist=chicago\
        --error=/ubc/cs/research/plai-scratch/BlackBoxML/error_eml.err\
        --output=/ubc/cs/research/plai-scratch/BlackBoxML/out_eml.out\
        /ubc/cs/research/plai-scratch/BlackBoxML/bbml-backend-3/ensemble_squared_2/ensemble_squared/run-client-search-bm.sh \
        ${job_id} '${job_name}' ${csv_file_name} ${timer} '${target_name}' ${email} '${callback}'`;
    },

  getUserId: function(id_token) {
    // TODO
    return Promise.resolve(id_token);
  },

  forwardOutPromise: forwardOutPromise,

  connect: function() {
    return ssh1.connect({
      host: 'remote.cs.ubc.ca',
      username: ssh_user,
      password: ssh_pw
    })
      .then(() => forwardOutPromise(ssh1.connection, ssh2))
      // .then(() => ssh2.execCommand('cd /ubc/cs/research/plai-scratch/BlackBoxML/bbml-backend-3'))
      .then(() => ssh2);
  },

  errorHandler: function (err, res) {
    console.error(err);
    res.status(400).send(err);
  },

  makeid: function (length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  getResults: function (fileHash, time, seed, saveDir) {
    return new Promise((resolve, reject) => {

      const result_path = String(ensemble_session_path + fileHash + '/ensemble/' + 't' + String(time) + '_' + 's' + String(seed) + "voting/full_ensemblesquared.csv");

      const ssh1 = new NodeSSH();
      const ssh2 = new NodeSSH();

      ssh1.connect({
        host: remote_ssh,
        username: ssh_user,
        password: ssh_pw
      })
        .then(() => this.forwardOutPromise(ssh1.connection, ssh2))
        .then(() => {
          console.log("Success connecting to borg");
          return ssh2.getFile(saveDir, result_path);
        })
        .then(() => resolve())
        .catch(err => reject(err));
    });
  },

  parseSqueue: function(stdOut, jobID) {
    if (stdOut && stdOut.includes(String(jobID))) {
      const idx = stdOut.search(jobID) + 37;  // time column starts here, may have trailing white space
      const end_idx = idx + 13;  // ends here, may have trailing white space
      const status = stdOut.slice(stdOut.search(jobID) + 34, (stdOut.search(jobID) + 37)).trim();
      const time_string = stdOut.slice(idx, end_idx).trim();

      let num_days;
      const idx_hr = time_string.search('-');

      if (idx_hr !== -1) {
        num_days = time_string.slice(0, idx_hr);
      } else {
        num_days = 0;
      }

      const str_without_days = time_string.slice(time_string.search('-') + 1, time_string.length);
      const num_hours = str_without_days.slice(0, str_without_days.search(':'));

      const str_without_hours = str_without_days.slice(str_without_days.search(':') + 1, str_without_days.length);
      const num_minutes = str_without_hours.slice(0, str_without_hours.search(':'));

      const time_elapsed = parseInt(num_minutes) + parseInt(num_hours) * 60 + parseInt(num_days) * 1440;
      return {time_elapsed, status};
    } else {
      return null;
    }
  }
};
