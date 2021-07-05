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
  });
}
