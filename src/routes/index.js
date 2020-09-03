const express = require("express");
const router = express.Router();
const userRouter = require("./user");
const movieRouter = require("./movie");
const evaluationRouter = require("./evaluation");

// ALL_METHOD : base_url/user 로 들어오는 라우터 모두 userRouter에서 처리

router.get("/", async (req, res, next) => {
  res.json({ success: true });
});
router.post("/", async (req, res, next) => {
  res.json({ success: true });
});

router.use("/user", userRouter);
router.use("/movie", movieRouter);
router.use("/evaluation", evaluationRouter);

module.exports = router;
