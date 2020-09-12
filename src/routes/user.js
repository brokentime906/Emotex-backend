const express = require("express");
const { createAccountWithEmail } = require("../controller/user");
const User = require("../schemas/User");
const router = express.Router();
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json({ users });
});
router.post("/", createAccountWithEmail);

router.post("/signin", async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) return res.json({ success: true, user });
  return res.json({ success: false });
});
module.exports = router;
