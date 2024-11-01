const otpService = require("../services/otpService");
const sellerService = require("../services/sellerService");
const jwt = require("jsonwebtoken");
const logger = require("../config/logger");

const requestOtp = async (req, res) => {
  const { phone, purpose } = req.body;
  const otp = otpService.generateOtp();

  try {
    await otpService.sendOtp(phone, otp);
    await otpService.saveOtp(phone, otp, "seller", purpose);
    logger.info(`OTP sent successfully to ${phone}`);
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    logger.error(`Failed to send OTP to ${phone}: ${error.message}`);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

const verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  const { isValid, message, purpose } = await otpService.verifyOtp(
    phone,
    otp,
    "seller"
  );
  if (!isValid) {
    logger.warn(`OTP verification failed for ${phone}: ${message}`);
    return res.status(400).json({ message });
  }

  if (purpose === "sign-in") {
    const token = jwt.sign({ phone }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    logger.info(`OTP verified successfully for ${phone} and user signed in`);
    return res.json({ message: "OTP verified", token });
  }

  logger.info(`OTP verified successfully for ${phone}`);
  res.json({ message: "OTP verified" });
};

const signUp = async (req, res) => {
  try {
    await sellerService.savePersonalInfo(req.body);
    logger.info(`Seller personal information saved for ${req.body.phone}`);
    res.json({ message: "Personal information saved" });
  } catch (error) {
    logger.error(
      `Error saving seller personal information for ${req.body.phone}: ${error.message}`
    );
    res.status(500).json({ message: "Error saving personal information" });
  }
};

module.exports = {
  requestOtp,
  verifyOtp,
  signUp,
};
