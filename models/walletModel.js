const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    unique: true,
    match: [
      /^[+][1-9][0-9]{9,14}$/,
      "Phone number must start with + and contain 10-15 digits.",
    ],
  },
  balance: {
    type: Number,
    default: 0,
  },
  otp: String,
  otpExpiry: Date,
  otpPurpose: String,
  transactions: [
    {
      amount: Number,
      date: {
        type: Date,
        default: Date.now,
      },
      type: {
        type: String,
        enum: ["withdrawal", "deposit", "debt", "debit"],
      },
      status: {
        type: String,
        enum: ["pending", "completed", "rejected", "approved"],
        default: "pending",
      },
      accountDetails: {
        accountType: String,
        serviceProvider: String,
        branch: String,
        iban: String,
        accountOwnerName: String,
      },
      receipt: String, 
    },
  ],
});

module.exports = mongoose.model("Wallet", walletSchema);
