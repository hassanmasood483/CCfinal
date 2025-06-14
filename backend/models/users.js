const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isGoogleUser: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
