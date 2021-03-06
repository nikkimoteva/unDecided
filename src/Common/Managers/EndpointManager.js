const axios = require('axios');
const root = '/api';

export function sendEmail(toSend) {
  return axios.post(`${root}/contactus`, {toSend}).then(res => res.data);
}

/*
 * Auth endpoints
 */
const authRoot = `${root}/auth`;

export function validateGoogleUser(id_token) {
  return axios.post(`${authRoot}/gauth`,{id_token});
}

export function validateUser(email, password) {
  return axios.post(`${authRoot}`,{email, password});
}

export function addUser(name, email, password) {
  return axios.post(`${authRoot}/addUser`,{name, email, password});
}

export function addAWSCred(email, accessKey, secretKey) {
  return axios.post(`${authRoot}/addAWSCred`, {email, accessKey, secretKey});
}

export function getAWSCred(email) {
  return axios.post(`${authRoot}/getAWSCred`, {email});
}


/*
* Job endpoints
*/
const jobRoot = `${root}/jobs`;

export function submitJob(id_token, jobName, maxJobTime, targetColumnName, dataset, header) {
  return axios.post(`${jobRoot}/submitTrainJob`, {
    id_token,
    jobName,
    maxJobTime,
    targetColumnName,
    dataset,
    header
  });
}

export function submitPrediction(id_token, predictionName, jobID, dataset) {
  return axios.post(`${jobRoot}/submitPrediction`, {id_token, predictionName, jobID, dataset});
}

export function getJobs(id_token) {
  return axios.post(`${jobRoot}`, {id_token});

}

export function getJob(id_token, jobID) {
  return axios.post(`${jobRoot}/job`, {id_token,jobID});
}

export function getPredictions(id_token,jobID) {
  return axios.post(`${jobRoot}/predictions`, {id_token,jobID});
}

export function downloadPredictionFile(id_token, predictionID) {
  return axios({
    url: `${jobRoot}/downloadPrediction`,
    method: "post",
    data: {id_token, predictionID},
    responseType: "blob"
  });
}

export function deleteJob(id_token, jobId) {
  const d = {id_token, jobId};
  return axios({
    method: "delete",
    url: `${jobRoot}/deleteJob`,
    data: d
  });
}

export function deletePrediction(id_token, predictionID) {
  const d = {id_token, predictionID};
  return axios({
    method: "delete",
    url: `${jobRoot}/deletePrediction`,
    data: d
  });
}


export function deletePredictionJobID(id_token, jobID) {
  const d = {id_token, jobID};
  return axios({
    method: "delete",
    url: `${jobRoot}/deletePredictionJobID`,
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
  console.log(`Listing objects for: ${bucketName}`);
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
