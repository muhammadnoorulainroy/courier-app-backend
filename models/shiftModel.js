const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema(
  {
    courierId: {
      type: String,
      ref: "Courier",
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: Date,
    penalty: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
    pendingDeliveries: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shift", shiftSchema);
