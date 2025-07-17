const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { setMaxListeners } = require("events");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const quizRoutes = require("./routes/quizRoutes");
// server.js or app.js
// so route becomes /api/reset-password

const app = express();

// Increase event listener limit to avoid MaxListenersExceededWarning
setMaxListeners(15);

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "https://your-frontend.vercel.app", // Replace with your Vercel URL
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api", authRoutes); 

// MongoDB connection with retry
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    setTimeout(connectDB, 5000); // Retry after 5 seconds
  }
};

// Start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
});