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
  penalizedParty: {
    type: String,
    enum: ["Sender", "Courier", "Recipient"],
    required: true,
  },
  penalizedId: {
    type: String, // ID of the penalized party
    required: true,
  },
  penalizedFirstName: {
    type: String,
    required: true,
  },
  penalizedLastName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

module.exports = mongoose.model("Penalty", penaltySchema);
