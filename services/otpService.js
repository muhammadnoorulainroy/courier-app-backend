const twilio = require("twilio");
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const Courier = require("../models/courierModel");
const Seller = require("../models/sellerModel");
const Wallet = require("../models/walletModel");

const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();

const sendOtp = async (phone, otp) => {
  await client.messages.create({
    body: `Your OTP is: ${otp}`,
    from: process.env.TWILIO_WHATSAPP_NUMBER,
    to: `whatsapp:${phone}`,
  });
};

// Helper to get the correct model based on user type
const getModel = (userType) => {
  if (userType === "courier") return Courier;
  if (userType === "seller") return Seller;
  if (userType === "wallet") return Wallet;
  throw new Error("Invalid user type");
};

const saveOtp = async (phone, otp, userType, purpose) => {
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes
  const Model = getModel(userType);
  await Model.updateOne(
    { phone },
    { otp, otpExpiry, otpPurpose: purpose },
    { upsert: true }
  );
};

const verifyOtp = async (phone, otp, userType) => {
  const Model = getModel(userType);
  const user = await Model.findOne({ phone });

  if (!user || user.otp !== otp) {
    return { isValid: false, message: "Invalid OTP" };
  }

  if (user.otpExpiry && new Date() > user.otpExpiry) {
    return { isValid: false, message: "OTP has expired" };
  }

  return { isValid: true, purpose: user.otpPurpose };
};

module.exports = { generateOtp, sendOtp, saveOtp, verifyOtp };
