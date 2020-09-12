const express = require("express");
const Movie = require("../schemas/Movie");
const router = express.Router();
var getYouTubeID = require("get-youtube-id");

var getYoutubeTitle = require("get-youtube-title");
const getThumb = require("video-thumbnail-url");
//get All Movie
router.get("/", async (req, res, next) => {
  const allMovie = await Movie.find({});
  res.json({ success: true, movies: allMovie });
});
router.get("/test", async (req, res, next) => {
  const url = "https://m.youtube.com/watch?v=Xmp20-Bo85w&pbj";
  try {
    const _thumbnail = await getThumb(url);
    var id = await getYouTubeID(url);
    console.log(_thumbnail, id);
  } catch (e) {
    console.log(e);
    return res.json({ msg: e });
  }
  return res.json({ msg: _thumbnail });
});

// get specific movie's data
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  const existsMovie = await Movie.findOne({ _id: id });
  if (existsMovie) {
    res.json({ success: true, movie: existsMovie });
  } else {
    res.json({ success: false, movie: {} });
  }
});
//crawling movie data and save data
router.post("/", async (req, res, next) => {
  const { url, title, view, good, bad, comments, image } = req.body;
  console.log(url);
  try {
    await Movie.create({ url, title, view, good, bad, comments, image });
    res.json({ success: true, message: "Save Success" });
  } catch (err) {
    console.log(err);
    res.status(401).json({ success: false, message: "Error " });
  }
});
module.exports = router;
