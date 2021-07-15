const axios = require('axios');
const root = `http://localhost:3001`; // make sure this matches up with backend

/**
 * A file for storing endpoint calls. Let the caller handle errors, so it can display appropriate errors to client
 */

export function validateGoogleUser(id_token) {
  return axios.post(`${root}/gauth`,{id_token});
}

/*
* Main endpoints
*/

export function submitJob(id_token, jobName, maxJobTime, dataset) {
  return axios.post(`${root}/submitJob`, {jobName, maxJobTime, dataset});
}

export function getJobs(id_token) {
  return axios({
    method: "get",
    url: `${root}/jobs`,
    data: {id_token}
  });
}

export function deleteJob(id_token, jobId) {
  return axios({
    method: "delete",
    url: `${root}/deleteJob`,
    data: {id_token, jobId}
  });
}

/*
* AWS endpoints
*/

export function registerAWS(region, accessKeyId, secretAccessKey) {
  return axios({
    method: "post",
    url: `${root}/registerAWS`,
    data: {region, credentials: {accessKeyId, secretAccessKey}}
  });
}

export function listBuckets() {
  return axios.get(`${root}/listBuckets`)
    .then(res => res.data);
}

export function listObjects(bucketName) {
  console.log(`Listing objects for: ${bucketName}`);
  return axios({
    method: "post",
    url: `${root}/listObjects`,
    data: {bucketName: bucketName}
  })
    .then(res => res.data);
}

export function getObject(bucketName, key) {
  console.log(`Retrieving file ${key}`);
  return axios({
    method: "post",
    url: `${root}/getObject`,
    data: {bucketName, key}
  })
    .then(res => res.data);
}
