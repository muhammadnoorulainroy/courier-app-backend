const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  courierId: {
    type: String,
    ref: "Courier",
    required: true,
  },
  senderId: {
    type: String,
    ref: "Seller",
    required: true,
  },
  recipientId: {
    type: String,
    ref: "Recipient",
    required: false,
  },
  shipmentId: {
    type: String,
    ref: "Shipment",
    required: false,
  },
  rating: {
    type: Number,
    required: true,
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating cannot exceed 5"],
  },
  comment: {
    type: String,
    maxlength: [500, "Comment cannot exceed 500 characters"],
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Review", reviewSchema);
