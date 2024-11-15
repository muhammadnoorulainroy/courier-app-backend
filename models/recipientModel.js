const mongoose = require("mongoose");

const recipientSchema = new mongoose.Schema(
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
      addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
      userId: {
        type: String,
        required: true,
        unique: true
      },
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model("Recipient", recipientSchema);