// const yt = require("youtube-search-without-api-key");
// async function fn() {
//   const data = await yt.search(`Cat`);
//   console.log(data);
// }
// fn();

// var fetchVideoInfo = require("youtube-info");
// fetchVideoInfo("vR8NrjbKHlg").then(function (videoInfo) {
//   console.log(videoInfo);
// });

// fetchVideoInfo("DpQVSzxrrCQ", function (err, videoInfo) {
//   if (err) throw new Error(err);
//   console.log(videoInfo);
// });

///
var crawler = require("youtube-crawler");

crawler("Dragon", function (results) {
  console.dir(results); //Outputs an array filled with cat videos.
});
