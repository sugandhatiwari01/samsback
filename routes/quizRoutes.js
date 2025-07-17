const express = require('express');
const router = express.Router();
const QuizData = require('../models/QuizData');

router.post('/', async (req, res) => {
  try {
    const { userId, faceShape, bodyType, stylePreferences } = req.body;

    if (!userId || !faceShape || !bodyType || !stylePreferences) {
      return res.status(400).json({ error: "Missing required fields" }); // ⬅️ likely cause of 400
    }

    const newQuiz = new QuizData({
      userId,
      faceShape,
      bodyType,
      stylePreferences,
      submittedAt: new Date(),
    });

    await newQuiz.save();
    res.status(201).json({ message: "Quiz saved successfully" });
  } catch (err) {
    console.error("Error saving quiz:", err.message); // ⬅️ Log backend error
    res.status(500).json({ error: "Failed to save quiz data" });
  }
});

module.exports = router;
