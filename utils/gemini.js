const { GoogleGenerativeAI } = require("@google/generative-ai");

const getClothingSuggestions = async (prompt) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the response (assuming it returns a JSON string)
    const suggestions = JSON.parse(text);
    return suggestions;
  } catch (err) {
    throw new Error("Gemini API error: " + err.message);
  }
};

module.exports = { getClothingSuggestions };