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

// View all sellers
const viewSellers = async (req, res) => {
  try {
    const sellers = await sellerService.getAllSellers();
    logger.info("Retrieved all sellers successfully");
    res.json({ sellers });
  } catch (error) {
    logger.error(`Error retrieving sellers: ${error.message}`);
    res.status(500).json({ message: "Error retrieving sellers" });
  }
};

// Edit seller
const editSeller = async (req, res) => {
  const { sellerId } = req.params;
  const { phone, financialPhone, firstName, lastName, businessName, isActive } = req.body;

  try {
    const updatedSeller = await sellerService.updateSeller(sellerId, {
      phone,
      financialPhone,
      firstName,
      lastName,
      businessName,
      isActive,
    });

    if (!updatedSeller) {
      logger.error(`Seller with ID ${sellerId} not found.`);
      return res.status(404).json({ message: "Seller not found" });
    }

    logger.info(`Seller with ID ${sellerId} updated successfully.`);
    res.json({ message: "Seller updated successfully", seller: updatedSeller });
  } catch (error) {
    logger.error(`Error updating seller: ${error.message}`);
    res.status(500).json({ message: "Error updating seller" });
  }
};

// Delete seller
const deleteSeller = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await sellerService.removeSeller(id);
    if (!result) {
      logger.warn(`Seller with ID ${id} not found`);
      return res.status(404).json({ message: "Seller not found" });
    }
    logger.info(`Deleted seller with ID ${id} successfully`);
    res.json({ message: "Seller deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting seller with ID ${id}: ${error.message}`);
    res.status(500).json({ message: "Error deleting seller" });
  }
};

module.exports = {
  requestOtp,
  verifyOtp,
  signUp,
  viewSellers,
  editSeller,
  deleteSeller,
};
