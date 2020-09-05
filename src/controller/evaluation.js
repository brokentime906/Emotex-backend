const fs = require("fs");
const Evaluation = require("../schemas/Evaluation");
var base64ToImage = require("base64-to-image");

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
  // console.log(req.body);
  const parsedData = JSON.parse(req.body["postData,"]);
  const image = parsedData.image.replace("\n", "");
  await fs.writeFileSync(__dirname + "image_encoded.txt", image);
  // const { movie_url, user_email } = req.body;
  const movie_url = "test Movie";
  const user_email = "test hello";

  var base64Str = image;
  var path = "./";
  var optionalObj = {
    fileName: `imageFileName ${idx.toString()}`,
    type: "jpg",
  };

  await base64ToImage(base64Str, path, optionalObj);
  try {
    const newEvaluation = new Evaluation({ movie_url, user_email, image });
    const result = await newEvaluation.save();
    console.log(result, " 저장함 ");
    res.json({ succes: true });
  } catch (err) {
    console.log("저장 실패");
    console.log(err);
    res.json({ succes: false });
  }
};
