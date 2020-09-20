const express = require("express");
const Evaluation = require("../schemas/Evaluation");
const router = express.Router();
const FormData = require("form-data");
const fs = require("fs");
const api = require("../api/DL_Model");
const {
  getCount,
  createEvaluation,
  getEvaluationByEmail,
  getEvaluationByMovie,
} = require("../controller/evaluation");

//get Count number
router.post("/", createEvaluation);
router.get("/cnt", getCount);
router.post("/movie", getEvaluationByMovie);

router.get("/email/:email", getEvaluationByEmail);

module.exports = router;
