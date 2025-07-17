const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  faceShape: { type: String, required: true },
  bodyType: { type: String, required: true },
  stylePreferences: [{ type: String, required: true }],
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('QuizData', quizSchema);
