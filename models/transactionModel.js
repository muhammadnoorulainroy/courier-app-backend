const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  walletId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Wallet",
    required: true,
  },
  userId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["debit", "credit"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  inOut: {
    type: String,
    enum: ["In", "Out", "Pass-through"],
    required: true,
  },
  reason: {
    type: String,
    required: true,
    enum: ["Delivery Payment", "Refund", "Penalty", "Bonus", "Fees", "Promocode", "POD", "Other"],
  },
  description: {
    type: String,
    required: true,
  },
  trackingId: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
