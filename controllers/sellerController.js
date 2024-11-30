const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

const otpService = require("../services/otpService");
const sellerService = require("../services/sellerService");
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

  try {
    const { isValid, message, purpose } = await otpService.verifyOtp(phone, otp, "seller");
    if (!isValid) {
      logger.warn(`OTP verification failed for ${phone}: ${message}`);
      return res.status(400).json({ message });
    }

    if (purpose === "sign-in") {
      let user = await sellerService.findSellerByPhone(phone);
      let userType = "Seller";

      if (!user) {
        logger.warn(`User with phone ${phone} not found`);
        return res.status(404).json({ message: "User not found" });
      }

      const token = jwt.sign({ phone, userType, userId: user.userId }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      const sessionDetails = {
        startTime: new Date(),
        endTime: null, // To be updated when the session ends
        duration: null, // To be calculated
      };
      await sellerService.recordSession(user.userId, sessionDetails);

      logger.info(`OTP verified successfully for ${phone} and user signed in`);
      return res.json({ 
        message: "OTP verified", 
        token, 
        user
      });
    }

    logger.info(`OTP verified successfully for ${phone}`);
    res.json({ message: "OTP verified" });
  } catch (error) {
    logger.error(`Error verifying OTP for ${phone}: ${error.message}`);
    res.status(500).json({ message: "Error verifying OTP" });
  }
};

const signUp = async (req, res) => {
  try {
    const userId = uuidv4()
    const seller = await sellerService.savePersonalInfo(userId, req.body);
    logger.info(`Seller personal information saved for userId: ${userId}`);
    res.json({ message: "Personal information saved", seller });
  } catch (error) {
    logger.error(
      `Error saving seller personal information for userId: ${req.body.userId}: ${error.message}`
    );
    res.status(500).json({ message: "Error saving personal information", error: error.message });
  }
};

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

const editSeller = async (req, res) => {
  const { userId } = req.params;
  const { phone, financialPhone, firstName, lastName, businessName, isActive } = req.body;

  try {
    const updatedSeller = await sellerService.updateSeller(userId, {
      phone,
      financialPhone,
      firstName,
      lastName,
      businessName,
      isActive,
    });

    if (!updatedSeller) {
      logger.error(`Seller with userId ${userId} not found.`);
      return res.status(404).json({ message: "Seller not found" });
    }

    logger.info(`Seller with userId ${userId} updated successfully.`);
    res.json({ message: "Seller updated successfully", seller: updatedSeller });
  } catch (error) {
    logger.error(`Error updating seller: ${error.message}`);
    res.status(500).json({ message: "Error updating seller", error: error.message });
  }
};

const deleteSeller = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await sellerService.removeSeller(userId);
    if (!result) {
      logger.warn(`Seller with userId ${userId} not found`);
      return res.status(404).json({ message: "Seller not found" });
    }
    logger.info(`Deleted seller with userId ${userId} successfully`);
    res.json({ message: "Seller deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting seller with userId ${userId}: ${error.message}`);
    res.status(500).json({ message: "Error deleting seller", error: error.message });
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
