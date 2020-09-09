const mongoose = require("mongoose");

const { Schema } = mongoose;
data = {
  neutral: 0.004494509,
  Happiness: 0.4531575,
  Sad: 0.19545949,
  Surprise: 0.1719676,
  Fear: 0.084014125,
  Disgust: 0.03195568,
  Anger: 0.05895111,
  Valence: 0.052831307,
  Arousal: 0.020094475,
};
const EvaluationSchema = new Schema({
  movie_url: { required: true, type: String, unique: true },
  user_email: { required: true, type: String, unique: true },
  cnt: { required: false, type: Number },
  time_stamp: { required: false, type: String },
  image: { required: true, type: String },
  Happiness: { required: false, type: Number },
  Sad: { required: false, type: Number },
  Fear: { required: false, type: Number },
  Disgust: { required: false, type: Number },
  Surprise: { required: false, type: Number },
  neutral: { required: false, type: Number },
  Anger: { required: false, type: Number },
  Valence: { required: false, type: Number },
  Arousal: { required: false, type: Number },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Evaluation", EvaluationSchema, "Evaluation");
