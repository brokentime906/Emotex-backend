const fs = require("fs");
const Evaluation = require("../schemas/Evaluation");
var base64ToImage = require("base64-to-image");
const axios = require("axios");
const FormData = require("form-data");
const colors = require("colors");
const Movie = require("../schemas/Movie");
const User = require("../schemas/User");
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

exports.getEvaluationByEmail = async (req, res, next) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.stats(500).json({ msg: "유저없어" });
    const evaluations = await Evaluation.find({
      user_email: user,
    }).select("movie_url");
    const movie_urls = await Promise.all(
      evaluations.map((movie) => movie.movie_url)
    );
    // return res.json({
    //   msg: "movie _ urls ",
    //   movie_ids: [...new Set(movie_urls)],
    // }); // ok
    const movies = await Movie.find().where("_id").in(movie_urls).exec();
    return res.json({ msg: "movies ok ", movies }); // ok

    res.status(200).json({ success: true, data: evaluations });
  } catch (err) {
    res.status(400).json({ success: false, msg: "DB Error" });
  }
};
let idx = 1;
const dev = true;
exports.createEvaluation = async (req, res, next) => {
  console.log(`create Eval starts`.green.bold);
  let parsedData;
  let image, url, time, age, gender;
  if (!dev) {
    parsedData = JSON.parse(req.body["postData,"]); //dev

    image = parsedData.image.replace("\n", "");
    url = parsedData.url.replace("\n", "");
    time = parsedData.time;
    age = parsedData.age;
    gender = parsedData.gender;
    console.log("Helo");
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

      // const newEvaluation = new Evaluation({
      //   movie_url: url,
      //   user_email,
      //   image: base64Str,
      //   ...result.data,
      // });
      // console.log(req.body);
      // const _result = await newEvaluation.save();
      console.log(_result, " 저장함 ");
      // console.log("전송성공", result.data);
      console.log(url, time, age, gender);
      res.json({ success: true });
    } catch (err) {
      // if (err.response.status === 500)
      console.log("전송실패");

      console.log(err);
      res.json({ success: false });
      errOccur = true;
    }
  } else {
    // const { url, user_email, age, gender, cnt,Sad,Fear,Disgust,Surprise,neutral,Anger,Valence,Arousal } = req.body;
    const { url, user_email } = req.body;
    try {
      const movie = await Movie.findOne({ url });
      if (!movie) {
        return res.status(500).json({ message: "존재하지 않는 Movie" });
      }
      const user = await User.findOne({ email: user_email });
      if (!user) return res.status(500).json({ message: "존재하지 않는 유저" });
      const evaluation = await Evaluation.create({
        ...req.body,
        movie_url: movie.id,
        user_email: user,
      });
      res.status(200).json({ success: true, evaluation });
    } catch (e) {
      res.status(500).json({ success: false, message: e });
    }
  }
};
