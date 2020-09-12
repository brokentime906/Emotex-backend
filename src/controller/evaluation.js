const fs = require("fs");
const Evaluation = require("../schemas/Evaluation");
var base64ToImage = require("base64-to-image");
const axios = require("axios");
const FormData = require("form-data");
const colors = require("colors");
const Movie = require("../schemas/Movie");
const User = require("../schemas/User");
var getYouTubeID = require("get-youtube-id");

var getYoutubeTitle = require("get-youtube-title");
const getThumb = require("video-thumbnail-url");
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
    console.log("email", email);
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email });
      // return res.stats(500).json({ msg: "유저없어" });
    }
    const evaluations = await Evaluation.find({
      user_email: user._id,
    }).select("movie_url");
    console.log("works here?".red.bold);
    let movie_urls = [];
    if (evaluations && evaluations.length > 0) {
      movie_urls = await Promise.all(
        evaluations.map((movie) => movie.movie_url)
      );
    } else {
      return res.json({ success: true, movies: [], evaluationList: [] });
    }
    // return res.json({
    //   msg: "movie _ urls ",
    //   movie_ids: [...new Set(movie_urls)],
    // }); // ok
    const movies = await Movie.find().where("_id").in(movie_urls).exec();
    // return res.json({ msg: "movies ok ", movies }); // ok
    const evaluationList = await Promise.all(
      movies.map(
        async (movie) => await Evaluation.find({ movie_url: movie.id })
      )
    );
    res.status(200).json({ success: true, movies, evaluationList });
  } catch (err) {
    res.status(400).json({ success: false, msg: "DB Error" });
  }
};
let idx = 1;
const dev = false;
exports.createEvaluation = async (req, res, next) => {
  console.log(`create Eval starts`.green.bold);
  let parsedData = req.body["postData,"];
  let image, url, time, age, gender, email;

  if (!dev) {
    // parsedData = JSON.stringify(req.body["postData,"]);

    parsedData = JSON.parse(parsedData); //dev
    image = parsedData.image.replace("\n", "");
    url = parsedData.url.replace("\n", "");
    url = url.replace("m.", "");
    time = parsedData.time;
    age = parsedData.age;
    gender = parsedData.gender;
    email = parsedData.email;
    console.log(email, parsedData.id);
    console.log("** keys **", Object.keys(JSON.parse(req.body["postData,"])));
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
      console.log("Here works 5".red.bold);
      let movie = await Movie.findOne({ url });
      if (!movie) {
        const _thumbnail = await getThumb(url);
        console.log("url thumn", url, _thumbnail);
        var id = getYouTubeID(url);

        const _title = await new Promise((resolve) =>
          getYoutubeTitle(id, (err, title) => resolve(title))
        );
        console.log(_title);
        movie = await Movie.create({
          url,
          thumbnail: _thumbnail,
          title: _title,
        });

        return res.json({ msg: "여기 되냐 ?" });
      }
      console.log(result.data);
      // return res.json({ result. });
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({ email });
      }
      const newEvaluation = new Evaluation({
        movie_url: movie.id,
        user_email: user.id,
        image: base64Str,
        ...result.data,
      });
      // console.log(req.body);
      const _result = await newEvaluation.save();
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
