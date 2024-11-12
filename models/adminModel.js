const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    minlength: [2, "First name must be at least 2 characters long"],
    maxlength: [50, "First name cannot exceed 50 characters"],
    match: [/^[A-Za-z\s]+$/, "First name can only contain letters and spaces"]
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    minlength: [2, "Last name must be at least 2 characters long"],
    maxlength: [50, "Last name cannot exceed 50 characters"],
    match: [/^[A-Za-z\s]+$/, "Last name can only contain letters and spaces"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
  },
  position: {
    type: String,
    required: [true, "Position is required"],
    minlength: [2, "Position must be at least 2 characters long"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"]
  },
  signUpDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  permissions: {
    dashboard: { type: Boolean, default: false },
    adminUsers: { type: Boolean, default: false },
    notifications: { type: Boolean, default: false },
    senders: { type: Boolean, default: false },
    couriers: { type: Boolean, default: false },
    recipients: { type: Boolean, default: false },
    shipments: { type: Boolean, default: false },
    promocodes: { type: Boolean, default: false },
    transactions: { type: Boolean, default: false },
    penalties: { type: Boolean, default: false },
    finance: { type: Boolean, default: false },
    reports: { type: Boolean, default: false },
    cliQ: { type: Boolean, default: false }
  }
}, { timestamps: true });

module.exports = mongoose.model("Admin", adminSchema);
