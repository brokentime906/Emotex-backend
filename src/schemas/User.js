const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
  user_id: { required: true, type: String, unique: true },
  password: { required: true, type: String },
  nick_name: { required: true, type: String },
  summoner_name: { required: false, type: String },
  summoner_tier: { required: false, type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema, "User");
