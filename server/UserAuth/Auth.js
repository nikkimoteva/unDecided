const googleClientId = "296036318202-uraiim5u0cf5qpqhujl3aaj1kniuu41e.apps.googleusercontent.com";

const axios = require('axios');
const UserModel = require('../database/models/User');

function verifyAuth(req) {
  const userToken = req.body.id_token;
  let body;
  return new Promise((resolve, reject) => {
    axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${userToken}`)
      .then(axiosRes => {
        if (axiosRes.status !== 200) throw new Error();
        body = axiosRes.data;
        if (body.aud !== googleClientId) reject("Incorrect aud");
        return UserModel.find({
          email: body.email
        });
      })
      .then(users => {
        if (users.length !== 0) return users[0];
        const newUser = new UserModel({
          email: body.email,
          name: body.name,
        });
        return newUser.save();
      })
      .then(_ => resolve())
      .catch(err => reject(err));
  });
}

exports.verifyAuth = verifyAuth;
