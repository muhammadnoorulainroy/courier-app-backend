const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const addressSchema = new mongoose.Schema(
  {
    district: String,
    streetName: String,
    buildingNumber: String,
    floorNumber: String,
    apartmentNumber: String,
    closestLandmark: String,
    locationLink: String,
  },
  { _id: false }
);

const trackingStatusSchema = new mongoose.Schema(
  {
    status: { type: String, required: true }, // e.g., "Created", "Picked Up", "In Transit", "Delivered"
    location: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const shipmentSchema = new mongoose.Schema(
  {
    shipmentId: {
      type: String,
      unique: true,
      default: () => uuidv4(),
    },
    trackingId: {
      type: String,
      unique: true,
    },
    type: { type: String, enum: ["Piece", "Bulk"], required: true },
    weight: { type: Number, required: true },
    dimensions: {
      length: Number,
      height: Number,
      width: Number,
    },
    pickUpDetails: {
      date: Date,
      time: String,
      location: addressSchema,
    },
    dropOffDetails: {
      date: Date,
      time: String,
      recipient: {
        firstName: String,
        lastName: String,
        phone: String,
        whatsapp: String,
      },
      location: addressSchema,
    },
    paymentDetails: {
      initialAmount: Number,
      finalAmount: Number,
      paymentStatus: {
        type: String,
        enum: ["Pending", "Completed"],
        default: "Pending",
      },
    },
    summary: {
      totalCost: Number,
      discount: Number,
      taxes: Number,
    },
    status: { type: String, default: "Created" },
    courierPhone: { type: String, default: null },
    trackingStatus: [trackingStatusSchema],
  },
  { timestamps: true }
);

shipmentSchema.pre("save", function (next) {
  if (!this.trackingId) {
    const uuid = uuidv4().replace(/-/g, '');
    const numericId = parseInt(uuid, 16).toString().slice(0, 12);
    this.trackingId = `TRK-${numericId}`;
  }
  next();
});

module.exports = mongoose.model("Shipment", shipmentSchema);
