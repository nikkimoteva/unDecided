const axios = require('axios');
const root = '/api'; // make sure this matches up with backend

/**
 * A file for storing endpoint calls. Let the caller handle errors, so it can display appropriate errors to client
 */

/*
 * Auth endpoints
 */
const authRoot = `${root}/auth`;

export function validateGoogleUser(id_token) {
  return axios.post(`${authRoot}/gauth`,{id_token});
}

/*
* Job endpoints
*/
const jobRoot = `${root}/jobs`;

export function submitJob(id_token, jobName, maxJobTime, targetColumn, targetColumnName, dataset) {
  return axios.post(`${jobRoot}/submitJob`, {id_token, jobName, maxJobTime, targetColumn, targetColumnName, dataset});
}

export function getJobs(id_token) {
  return axios.post(`${jobRoot}`, {id_token});

}

export function deleteJob(id_token, jobId) {
  const d = {id_token, jobId};
  console.log(d);

  return axios({
    method: "delete",
    url: `${jobRoot}/deleteJob`,
    data: d
  });
}

/*
* AWS endpoints
*/

const awsRoot = `${root}/aws`;

export function registerAWS(region, accessKeyId, secretAccessKey) {
  return axios({
    method: "post",
    url: `${awsRoot}/register`,
    data: {region, credentials: {accessKeyId, secretAccessKey}}
  });
}

export function listBuckets() {
  return axios.get(`${awsRoot}/listBuckets`)
    .then(res => res.data);
}

export function listObjects(bucketName) {
  return axios({
    method: "post",
    url: `${awsRoot}/listObjects`,
    data: {bucketName: bucketName}
  })
    .then(res => res.data);
}

export function getObject(bucketName, key) {
  console.log(`Retrieving file ${key}`);
  return axios({
    method: "post",
    url: `${awsRoot}/getObject`,
    data: {bucketName, key}
  })
    .then(res => res.data);
}
