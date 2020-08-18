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
  if (req.user) {
    res.send(req.user);
  } else {
    res.send(`<button><a href="/google">login</a> </button>`);
  }
});
router.get(
  "/oauth2callback",
  passport.authenticate("google"),
  async (req, res, next) => {
    res.send(req.user);
  }
);
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

module.exports = router;
