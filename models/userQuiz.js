const mongoose = require("mongoose");

const userQuizSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  faceShape: String,
  bodyType: String,
  skinTone: String,
  gender: String,
  height: String,
  weight: String,
});

module.exports = mongoose.model("UserQuiz", userQuizSchema);
