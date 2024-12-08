const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const notificationSchema = new mongoose.Schema(
  {
    notificationId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    recipients: [
      {
        recipientId: {
          type: String,
          required: true,
        },
        recipientType: {
          type: String,
          required: true,
          enum: ["Courier", "Seller", "Recipient"],
        },
      },
    ],
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Push", "Email", "SMS"],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    button: {
      title: String,
      color: String,
      link: String,
    },
    schedule: {
      date: Date,
      time: String,
    },
    repeat: {
      date: Date,
      days: Number,
      hours: Number,
      minutes: Number,
    },
    status: {
      type: String,
      enum: ["Pending", "Scheduled", "Sent"],
      default: "Pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    engagementMetrics: {
      openRate: { type: Number, default: 0 }, // Open rate percentage
      clickRate: { type: Number, default: 0 }, // Click rate percentage
      numberOfOpens: { type: Number, default: 0 },
      numberOfClicks: { type: Number, default: 0 },
      bounceStatus: { type: String, enum: ["Soft Bounce", "Hard Bounce", "No Bounce"], default: "No Bounce" },
      deliveryDuration: { type: Number, default: 0 }, // Time taken for delivery in milliseconds
    },
    relatedTransactionId: {
      type: String,
      required: false, // Optional field, links to the associated transaction
    },
    relatedShipmentId: {
      type: String,
      required: false, // Optional field, links to the associated shipment
    },
    relatedPromoId: {
      type: String,
      required: false, // Optional field, links to a promo or discount
    },
    notificationReason: {
      type: String,
      enum: ["Shipment Status Update", "Payment Reminder", "New Promo", "Other"],
    },
    performanceMetrics: {
      deliveredCount: { type: Number, default: 0 },
      failedCount: { type: Number, default: 0 },
      engagementScore: { type: Number, default: 0 }, // Calculated score based on open rate, click rate, etc.
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
