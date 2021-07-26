// const {OAuth2Client} = require('google-auth-library');
const googleClientId = "296036318202-uraiim5u0cf5qpqhujl3aaj1kniuu41e.apps.googleusercontent.com";
// const client = new OAuth2Client(googleClientId);
//
// // not really needed unless we go into actual production.
// async function verify() {
//   const ticket = await client.verifyIdToken({
//     idToken: id_token,
//     audience: googleClientId,  // Specify the CLIENT_ID of the app that accesses the backend
//     // Or, if multiple clients access the backend:
//     //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
//   });
//   const payload = ticket.getPayload();
//   return payload['sub'];
//   // If request specified a G Suite domain:
//   // const domain = payload['hd'];
// }
//
// exports.verify = verify;

const axios = require('axios');
const UserModel = require('../database/models/User');

function verifyAuth(req) {
  const userToken = req.body.id_token;
  // not really needed unless we go into actual production.
  // verify(userToken)
  //   .then((userId) => {
  //     const profile = req.body.profile;
  //     const name = profile.name;
  //     const imageUrl = profile.imageUrl;
  //     const email = profile.email; // This is null if the 'email' scope is not present.
  //     
  //
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.sendStatus(401);
  //   })
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
          email: body.email, // TODO: Implement getUserId (replace with actual user id)
          name: body.name,
          // picture: body.picture,
          // email: body.email
        });
        return newUser.save();
      })
      .then(_ => resolve())
      .catch(err => reject(err));
  });
}

function getUserId(id_token) {
  // TODO
  return Promise.resolve(id_token);
}

exports.verifyAuth = verifyAuth;
exports.getUserId = getUserId;
