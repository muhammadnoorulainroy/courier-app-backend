const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema({
  courierId: {
    type: String,
    ref: "Courier",
    required: true,
  },
  reportedBy: {
    type: String,
    required: true,
    enum: ["Sender", "Recipient", "Admin"],
  },
  reportedById: {
    type: String,
    required: true,
  },
  incidentType: {
    type: String,
    required: true,
    enum: [
      "Late Delivery",
      "No-Show",
      "Damaged Shipment",
      "Misbehavior",
      "Other",
    ],
  },
  description: {
    type: String,
    maxlength: [1000, "Description cannot exceed 1000 characters"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Open", "In Progress", "Resolved"],
    default: "Open",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resolvedAt: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("Incident", incidentSchema);
