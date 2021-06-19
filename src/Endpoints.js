const axios = require('axios');
const root = `http://localhost:3001`; // make sure this matches up with backend

export function validateGoogleUser(id_token) {
  return axios.post(`${root}/gauth`,{id_token})
}
