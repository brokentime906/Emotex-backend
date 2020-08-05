const { OAuth2Client } = require("google-auth-library");
const {
  web: { client_id: CLIENT_ID },
} = require("./client_secret.json");

const client = new OAuth2Client(CLIENT_ID);

async function verify() {
  const token =
    "ya29.a0AfH6SMDLPqoh6aiBv0ZtcDmrQrQZuj2tLCDP2tZN3_rOE6uc17FWlxlinEfU_lmhi-t8MFHVKs_fjXuvsNVFprgqJE56ewhebbUuTxESk-hHaFVdM7umP2IgzP5PFYN3cUD7jKxd_47yoKxYd-KQr6nULBBoSjjol98";
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload["sub"];
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
}
verify().catch(console.error);
