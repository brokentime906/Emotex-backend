const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const youtube = google.youtube("v3");
const userRouter = require("./user");
const passport = require("passport");
const youtubeRouter = require("./youtube");
const { authenticate } = require("@google-cloud/local-auth");
const path = require("path");

// ALL_METHOD : base_url/user 로 들어오는 라우터 모두 userRouter에서 처리

router.get("/", async (req, res, next) => {
  res.send(`<h1>click btn</h1>
  <form action="/khan/sendImage" method="POST">
   <button type='submit' >  sendImage </button>
  </form>
   `);
});
router.post("/", async (req, res, next) => {
  console.log("start get token");
  console.log(req.query);
  console.log(req.body);
  const { idtoken: accessToken } = req.body;

  res.json({ success: "true" });
});
router.get(
  "/oauth2callback",
  passport.authenticate("google"),
  async (req, res, next) => {
    console.log("starts auth");
    console.log(req.query);
    res.send(req.user);
  }
);
router.post("/sendtoken", async (req, res, next) => {
  res.json({ success: true });
});
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);
router.get("/token", async (req, res, next) => {
  const body__ = req.body;
  console.log(body__);
  res.json({ success: true });
});
router.use("/user", userRouter);
router.use("/youtube", youtubeRouter);
const khan = require("./khan");
router.use("/khan", khan);
module.exports = router;
