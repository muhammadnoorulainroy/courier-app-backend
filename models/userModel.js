const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  // Other fields if needed
});

module.exports = mongoose.model("User", userSchema);
