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
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    governorate: { type: String, required: true }, // Added governorate field
    isSaved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
