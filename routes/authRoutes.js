const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const nodemailer = require("nodemailer");

// ✅ Register Route
router.post("/register", async (req, res) => {
  const { username, email, password, securityQuestion, securityAnswer } = req.body;

  if (!username || !email || !password || !securityQuestion || !securityAnswer) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedAnswer = await bcrypt.hash(securityAnswer, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      securityQuestion,
      securityAnswer: hashedAnswer
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Forgot Password Placeholder
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  // TODO: Implement sending OTP/email verification here
  return res.json({ success: true });
});

// ✅ Reset Password Route
router.post("/reset-password", async (req, res) => {
  const { email, answer, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(answer, user.securityAnswer);
    if (!isMatch) return res.status(400).json({ error: "Incorrect answer" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
