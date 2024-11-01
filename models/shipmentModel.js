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

const shipmentSchema = new mongoose.Schema(
  {
    // userId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
    shipmentId: {
        type: String,
        unique: true,
        default: () => uuidv4() // Generates a unique ID for each shipment
    },
    trackingId: {
        type: String,
        unique: true
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
  },
  { timestamps: true }
);

shipmentSchema.pre('save', function (next) {
    if (!this.trackingId) {
        this.trackingId = `TRK-${Math.floor(Math.random() * 1000000000)}`;
    }
    next();
});

module.exports = mongoose.model("Shipment", shipmentSchema);
