const express = require("express");
const router = express.Router();

const userRouter = require("./user");

// ALL_METHOD : base_url/user 로 들어오는 라우터 모두 userRouter에서 처리
router.use("/user", userRouter);

module.exports = router;
