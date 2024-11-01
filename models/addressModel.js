const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: {
      type: String,
      required: true,
      match: [
        /^[+][0-9]{10,15}$/,
        "Phone number must be in international format.",
      ],
    },
    whatsapp: {
      type: String,
      match: [
        /^[+][0-9]{10,15}$/,
        "WhatsApp number must be in international format.",
      ],
    },
    district: { type: String, required: true },
    streetName: { type: String, required: true },
    buildingNumber: { type: String, required: true },
    floorNumber: { type: String },
    apartmentNumber: { type: String },
    closestLandmark: { type: String },
    locationLink: { type: String },
    isSaved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
