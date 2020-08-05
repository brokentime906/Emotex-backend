const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
  google_id: { required: true, type: String, unique: true },
  username: { required: true, type: String },
  password: { required: false, type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema, "User");
