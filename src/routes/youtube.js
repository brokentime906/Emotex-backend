const express = require("express");
const router = express.Router();
const fs = require("fs");
const readline = require("readline");
const path = require("path");
const { google } = require("googleapis");
const youtube = google.youtube("v3");
const SCOPES = [
  "https://www.googleapis.com/auth/youtube",
  "https://www.googleapis.com/auth/youtube.readonly",
  "https://www.googleapis.com/auth/youtube.upload",
  "https://www.googleapis.com/auth/youtubepartner-channel-audit",
];
const TOKEN_PATH = "token.json";
router.get("/getUrl", async (req, res, next) => {
  const credentials = fs.readFileSync(
    path.join(__dirname, "./client_secret.json")
  );
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  const token = await oAuth2Client.getToken(code);
  await oAuth2Client.setCredentials(token);
});

function listFiles(auth) {
  const drive = google.drive({ version: "v3", auth });
  drive.files.list(
    {
      pageSize: 10,
      fields: "nextPageToken, files(id, name)",
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const files = res.data.files;
      if (files.length) {
        console.log("Files:");
        files.map((file) => {
          console.log(`${file.name} (${file.id})`);
        });
      } else {
        console.log("No files found.");
      }
    }
  );
}
// [END drive_quickstart]

module.exports = router;
