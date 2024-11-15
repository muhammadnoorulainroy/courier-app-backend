const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    district: { type: String, required: true },
    streetName: { type: String, required: true },
    buildingNumber: { type: String, required: true },
    floorNumber: { type: String },
    apartmentNumber: { type: String },
    closestLandmark: { type: String },
    locationLink: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    isSaved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);