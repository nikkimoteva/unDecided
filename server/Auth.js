const {OAuth2Client} = require('google-auth-library');
const googleClientId = "296036318202-uraiim5u0cf5qpqhujl3aaj1kniuu41e.apps.googleusercontent.com";
const client = new OAuth2Client(googleClientId);

// not really needed unless we go into actual production.
export async function verify() {
  const ticket = await client.verifyIdToken({
    idToken: id_token,
    audience: googleClientId,  // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  return payload['sub'];
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
}
