const mongoose = require("mongoose");

const penaltySchema = new mongoose.Schema({
  appliedTo: {
    type: String,
    required: true,
    match: /^[+][1-9][0-9]{9,14}$/, // International phone format
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    enum: ["Manual", "SenderCancellation", "CourierCancellation"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

module.exports = mongoose.model("Penalty", penaltySchema);
