const express = require("express");
const router = express.Router();
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const khanUrl = "http://3.129.245.236";
router.post("/test", async (req, res, next) => {
  const imageFile = await fs.readFileSync("./image.jpeg");
  console.log(imageFile);
  res.json({ suc: "a" });
});
router.post("/sendImage", async (req, res, next) => {
  console.log("sendImage starts");
  let result;
  try {
    const mfile = await fs.readFileSync("./image.jpeg");
    let data = new FormData();
    data.append("image", mfile, "image.jpeg");
    const headerOptions = {
      accept: "application/json",
      "Accept-Language": "en-US,en;q=0.8",
      "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
    };
    result = await axios.post(khanUrl, data, {
      headers: headerOptions,
    });
  } catch (err) {
    console.log(err);
    console.log("아 실패");
  }
  //from here data save , and send client ? holding
  console.log(result);
  console.log(result.data);
  res.json({ success: true });
});

module.exports = router;
