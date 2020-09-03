const express = require("express");
const Movie = require("../schemas/Movie");
const router = express.Router();

//get All Movie
router.get("/", async (req, res, next) => {
  const allMovie = await Movie.find({});
  res.json({ success: true, movies: allMovie });
});

// get specific movie's data
router.get("/:url", async (req, res, next) => {
  const { url } = req.params;
  const existsMovie = await Movie.findOne({ url });
  if (existsMovie) {
    res.json({ success: true, movie: existsMovie });
  } else {
    res.json({ success: false, movie: {} });
  }
});

//crawling movie data and save data
router.post("/:url", async (req, res, next) => {
  const { url } = req.params;
  console.log(url, " 을 크롤링해야해");
  res.json({ success: false, message: "NOT Developed" });
});
module.exports = router;
