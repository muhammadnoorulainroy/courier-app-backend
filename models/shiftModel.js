const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({
  courierPhone: {
    type: String,
    required: true,
    match: [/^[+][1-9][0-9]{9,14}$/, "Phone number must start with + and contain 10-15 digits."]
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: Date,
  penalty: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ["active", "completed"],
    default: "active"
  },
  pendingDeliveries: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("Shift", shiftSchema);
