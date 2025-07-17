const express = require('express');
const router = express.Router();
const QuizData = require('../models/QuizData');
const { getGeminiSuggestions } = require('../utils/gemini');

// GET outfit suggestions for a user
router.get('/user/:id/recommendations', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Get the latest quiz entry
    const latestQuiz = await QuizData.findOne({ userId })
      .sort({ submittedAt: -1 })
      .lean();

    if (!latestQuiz) {
      return res.status(404).json({ error: "Quiz data not found" });
    }

    const prompt = `Generate 3 personalized clothing suggestions for a user with the following details:
    - Face Shape: ${latestQuiz.faceShape}
    - Body Type: ${latestQuiz.bodyType}
    - Style Preferences: ${latestQuiz.stylePreferences.join(", ")}
    Follow 2025 fashion trends. Output as JSON array of 3 objects with fields: id, title, description, image (use placeholder URLs like https://via.placeholder.com/300x400?text=Outfit), and category.`;

    const suggestions = await getGeminiSuggestions(prompt);
    res.json(suggestions);
  } catch (err) {
    console.error("Gemini fetch error:", err.message);
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
});

module.exports = router;
