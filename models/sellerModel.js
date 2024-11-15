const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    unique: true,
    match: [
      /^[+][1-9][0-9]{9,14}$/,
      "Phone number must start with + and contain 10-15 digits.",
    ],
  },
  financialPhone: {
    type: String,
    required: [true, "Financial phone number is required"],
    match: [
      /^[+][1-9][0-9]{9,14}$/,
      "Financial phone number must start with + and contain 10-15 digits.",
    ],
  },
  otp: { type: String },
  otpExpiry: { type: Date },
  otpPurpose: { type: String },

  // Personal Info
  firstName: {
    type: String,
    required: [true, "First name is required"],
    minlength: [2, "First name must be at least 2 characters long"],
    maxlength: [50, "First name cannot exceed 50 characters"],
    match: [/^[A-Za-z\s]+$/, "First name can only contain letters and spaces"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    minlength: [2, "Last name must be at least 2 characters long"],
    maxlength: [50, "Last name cannot exceed 50 characters"],
    match: [/^[A-Za-z\s]+$/, "Last name can only contain letters and spaces"],
  },
  businessName: {
    type: String,
    required: [true, "Business name is required"],
    minlength: [2, "Business name must be at least 2 characters long"],
    maxlength: [100, "Business name cannot exceed 100 characters"],
    match: [
      /^[A-Za-z0-9\s'-.]+$/,
      "Business name can only contain letters, numbers, spaces, and limited special characters (' - .)",
    ],
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Seller", sellerSchema);
