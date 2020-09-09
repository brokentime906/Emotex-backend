const fs = require("fs");
const Evaluation = require("../schemas/Evaluation");
var base64ToImage = require("base64-to-image");
const axios = require("axios");
const FormData = require("form-data");
const colors = require("colors");
exports.getCount = async (req, res, next) => {
  const { movie_url, user_email } = req.body;
  try {
    const mEvaluation = await Evaluation.findOne({ movie_url, user_email });
    if (mEvaluation) {
      // const evaluations = Evaluation
      res.json({ succes: true, cnt: mEvaluation.length });
    } else {
      res.json({ succes: true, cnt: 0 });
    }
  } catch (err) {
    res.status(400).json({ succes: false, msg: "error in db" });
  }
};

exports.getEvaluationByEmailAndURL = async (req, res, next) => {
  const { email } = req.params;
  const { movie_url } = req.body;
  try {
    const evaluation = await Evaluation.find({
      user_email: email,
      movie_url: movie_url,
    });
    res.status(200).json({ success: true, data: evaluation });
  } catch (err) {
    res.status(400).json({ success: false, msg: "DB Error" });
  }
};
let idx = 1;
exports.createEvaluation = async (req, res, next) => {
  console.log(`create Eval starts`.green.bold);
  const parsedData = JSON.parse(req.body["postData,"]);
  const image = parsedData.image.replace("\n", "");
  const url = parsedData.url.replace("\n", "");
  const time = parsedData.time;
  await fs.writeFileSync(__dirname + "image_encoded.txt", image);

  const user_email = "test hello";

  const base64Str = image;
  const bitmap = await new Buffer(base64Str, "base64");
  await fs.writeFileSync("khan.jpeg", bitmap);

  console.log("sendImage starts");
  let result;
  let errOccur = false;
  try {
    const mfile = await fs.readFileSync("khan.jpeg");
    let data = new FormData();
    await data.append("image", mfile, "image.jpeg");
    const headerOptions = {
      accept: "application/json",
      "Accept-Language": "en-US,en;q=0.8",
      "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
    };
    const khanUrl = "http://mylabcom.ddns.net";

    result = await axios.post(khanUrl, data, {
      headers: headerOptions,
    });

    const newEvaluation = new Evaluation({
      movie_url: url,
      user_email,
      image: base64Str,
      ...result.data,
    });
    const _result = await newEvaluation.save();
    console.log(_result, " 저장함 ");
    console.log("전송성공", result.data);
    console.log(url, time);
    res.json({ success: true });
  } catch (err) {
    // if (err.response.status === 500)
    console.log("전송실패");

    console.log(err);
    res.json({ success: false });
    errOccur = true;
  }
  // console.log(Object.keys(req.body["postData,"]));
  if (errOccur) console.log("Error happened".red.bold);
  else console.log("Success Ends !".cyan.bold);
};
