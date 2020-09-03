const express = require("express");
const { createAccountWithEmail } = require("../controller/user");
const router = express.Router();

router.post("/", createAccountWithEmail);

router.post("/signin", async (req, res, next) => {});
module.exports = router;
