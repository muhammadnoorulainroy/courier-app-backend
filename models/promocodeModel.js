const mongoose = require("mongoose");

const promoCodeSchema = new mongoose.Schema({
  promoCode: {
    type: String,
    required: [true, "Promo code is required"],
    unique: true,
    trim: true,
  },
  startDate: {
    type: Date,
    required: [true, "Start date is required"],
  },
  endDate: {
    type: Date,
    required: [true, "End date is required"],
  },
  startTime: {
    type: String,
    required: [true, "Start time is required"],
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "Start time must be in HH:mm format"],
  },
  endTime: {
    type: String,
    required: [true, "End time is required"],
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "End time must be in HH:mm format"],
  },
  maxUses: {
    type: Number,
    required: [true, "Max number of uses is required"],
    min: [1, "Max number of uses must be at least 1"],
  },
  promoCodeType: {
    type: String,
    required: [true, "Promo code type is required"],
    enum: ["Percentage", "Fixed Amount", "BOGO"],
  },
  details: {
    percentage: {
      type: Number,
      required: function () { return this.promoCodeType === "Percentage"; },
      min: [1, "Percentage must be at least 1"],
      max: [100, "Percentage cannot exceed 100"],
    },
    maxUsesPerUser: {
      type: Number,
      min: [1, "Max uses per user must be at least 1"],
    },
    cap: {
      type: Number,
      min: [0, "Cap cannot be negative"],
    },
  },
  governoratesFrom: {
    type: [String],
    required: [true, "Governorates (From) are required"],
  },
  governoratesTo: {
    type: [String],
    required: [true, "Governorates (To) are required"],
  },
  paymentMethod: {
    type: String,
    required: [true, "Payment method is required"],
  },
  usersTargeted: {
    allUsers: { type: Boolean, default: false },
    specificUsers: [
      { type: String, match: [/^[+][0-9]{10,15}$/, "Phone number must be in international format"] }
    ],
  },
  minOrderAmount: {
    type: Number,
    min: [0, "Min order amount cannot be negative"],
  },
  status: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("PromoCode", promoCodeSchema);
