const mongoose = require("mongoose");

const { Schema } = mongoose;

const MovieSchema = new Schema({
  url: { required: true, type: String, unique: true },
  title: { required: false, type: String },
  view: { required: false, type: Number },
  bad: { required: false, type: Number },
  good: { required: false, type: Number },
  comments: { required: false, type: Number },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Movie", MovieSchema, "Movie");
