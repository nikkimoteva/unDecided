const axios = require('axios');
const root = `http://localhost:3001`; // make sure this matches up with backend

export function validateGoogleUser(id_token) {
  return axios.post(`${root}/gauth`,{id_token});
}

export function submitJob(jobName, maxJobTime, dataset) {
  return axios.post(`${root}/submitJob`, {jobName, maxJobTime, dataset});
}

export function getJobs(id_token) {
  return axios({
    method: "get",
    url: `${root}/jobs`,
    data: {id_token}
  })
    .then(res => res.data)
    .catch(err => alert(err));
}

export function registerAWS(identityPoolId) {
  return axios({
    method: "post",
    url: `${root}/registerAWS`,
    data: {identityPoolId}
  })
    .catch(err => alert(err));
}

export function listBuckets() {
  return axios.get(`${root}/listBuckets`)
    .then(res => res.data)
    .catch(err => alert(err));
}

export function listObjects(bucketName) {
  console.log(`Bucket Name: ${bucketName}`);
  return axios({
    method: "post",
    url: `${root}/listObjects`,
    data: {bucketName: bucketName}
  })
    .then(res => res.data)
    .catch(err => alert(err));
}

export function getObject(bucketName, key) {
  return axios({
    method: "post",
    url: `${root}/getObject`,
    data: {bucketName, key}
  })
    .then(res => res.data)
    .catch(err => alert(err));
}
