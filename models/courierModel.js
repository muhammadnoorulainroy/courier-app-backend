const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  governorate: { type: String, required: true },
  days: {
    type: [String],
    required: true,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },
  startHour: {
    type: String,
    match: [
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Start hour must be in HH:mm format",
    ],
    required: true,
  },
  finishHour: {
    type: String,
    match: [
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Finish hour must be in HH:mm format",
    ],
    required: true,
  },
});

const courierSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    unique: true,
    match: [
      /^[+][1-9][0-9]{9,14}$/,
      "Phone number must start with + and contain 10-15 digits.",
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
  idNumber: {
    type: String,
    required: [true, "ID number is required"],
  },
  idExpiryDate: {
    type: Date,
    required: [true, "ID expiry date is required"],
  },
  driverLicenseIssueDate: {
    type: Date,
    required: [true, "Driver license issue date is required"],
  },

  // Vehicle Info
  vehicleBrand: { type: String, required: true },
  vehicleModel: { type: String, required: true },
  vehicleYear: {
    type: Number,
    min: [1900, "Vehicle year cannot be before 1900"],
    max: [new Date().getFullYear(), "Vehicle year cannot be in the future"],
    required: true,
  },
  fuelType: {
    type: String,
    required: true,
    enum: ["Petrol", "Diesel", "Electric", "Hybrid"],
  },
  insuranceType: { type: String, required: true },
  insuranceExpiryDate: { type: Date, required: true },
  registrationExpiryDate: { type: Date, required: true },

  // Schedules
  dropOffSchedule: [scheduleSchema],
  pickUpSchedule: [scheduleSchema],

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Courier", courierSchema);
