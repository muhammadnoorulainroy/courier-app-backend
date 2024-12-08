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
  fees: {
    type: Number,
    default: 0,
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
  penaltyDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Penalty", // Reference to the Penalty Model
  },
  shipmentDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shipment", // Reference to the Shipment Model
  },
  promocodeUsed: {
    type: String, // Yes/No
  },
  promoSavings: {
    type: Number,
  }
});

module.exports = mongoose.model("Transaction", transactionSchema);
