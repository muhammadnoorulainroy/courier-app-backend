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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
