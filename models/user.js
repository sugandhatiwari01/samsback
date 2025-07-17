const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");



const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  securityQuestion: String,
  securityAnswer: String // store hashed for security
});

module.exports = mongoose.model("User", userSchema);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password for login
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);