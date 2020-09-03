const mongoose = require("mongoose");

const { Schema } = mongoose;

const EvaluationSchema = new Schema({
  movie_url: { required: true, type: String, unique: true },
  user_email: { required: true, type: String, unique: true },
  cnt: { required: false, type: Number },
  time_stamp: { required: false, type: String },
  image: { required: true, type: String },
  happy: { required: false, type: Number },
  sad: { required: false, type: Number },
  fear: { required: false, type: Number },
  disgust: { required: false, type: Number },
  surprise: { required: false, type: Number },
  neutral: { required: false, type: Number },
  angry: { required: false, type: Number },
  valence: { required: false, type: Number },
  arousal: { required: false, type: Number },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Evaluation", EvaluationSchema, "Evaluation");
