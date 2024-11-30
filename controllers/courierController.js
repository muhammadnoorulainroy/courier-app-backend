const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const otpService = require("../services/otpService");
const courierService = require("../services/courierService");
const documentService = require("../services/documentService");
const Courier = require("../models/courierModel");
const logger = require("../config/logger");

const checkCourierExistsByUserId = async (userId) => {
  const courier = await courierService.findUserByUserId(userId);
  return !!courier;
};

const requestOtp = async (req, res) => {
  const { phone, purpose } = req.body;

  const otp = otpService.generateOtp();
  try {
    await otpService.sendOtp(phone, otp);
    await otpService.saveOtp(phone, otp, "courier", purpose);
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
    const { isValid, message, purpose } = await otpService.verifyOtp(phone, otp, "courier");
    if (!isValid) {
      logger.warn(`OTP verification failed for ${phone}: ${message}`);
      return res.status(400).json({ message });
    }

    if (purpose === "sign-in") {
      let user = await courierService.findCourierByPhone(phone);
      let userType = "Courier";

      if (!user) {
        logger.warn(`User with phone ${phone} not found`);
        return res.status(404).json({ message: "User not found" });
      }

      const token = jwt.sign({ phone, userType, userId: user.userId }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      logger.info(`OTP verified successfully for ${phone} and user signed in`);

      return res.json({ 
        message: "OTP verified", 
        token: token, 
        user: user
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
    const userId = uuidv4();
    const courier = await courierService.savePersonalInfo(userId, req.body);
    logger.info(`Personal information saved for userId: ${userId}`);
    res.json({ message: "Personal information saved", courier });
  } catch (error) {
    logger.error(
      `Error saving personal information for ${req.body.userId}: ${error.message}`
    );
    res.status(500).json({ message: "Error saving personal information", error: error.message});
  }
};

const uploadDocuments = async (req, res) => {
  try {
    await documentService.updatePersonalDocuments(req.body.userId, req.files);
    logger.info(`Personal documents uploaded for ${req.body.userId}`);
    res.json({ message: "Documents uploaded successfully" });
  } catch (error) {
    logger.error(
      `Error uploading documents for ${req.body.userId}: ${error.message}`
    );
    res.status(500).json({ message: "Error uploading documents", error: error.message });
  }
};

const saveVehicleInfo = async (req, res) => {
  try {
    await courierService.saveVehicleInfo(req.body.userId, req.body);
    logger.info(`Vehicle information saved for ${req.body.userId}`);
    res.json({ message: "Vehicle information saved" });
  } catch (error) {
    logger.error(
      `Error saving vehicle information for ${req.body.userId}: ${error.message}`
    );
    res.status(500).json({ message: "Error saving vehicle information", error: error.message });
  }
};

const uploadVehicleDocuments = async (req, res) => {
  try {
    await documentService.updateVehicleDocuments(req.body.userId, req.files);
    logger.info(`Vehicle documents uploaded for ${req.body.userId}`);
    res.json({ message: "Vehicle documents uploaded successfully" });
  } catch (error) {
    logger.error(
      `Error uploading vehicle documents for ${req.body.userId}: ${error.message}`
    );
    res.status(500).json({ message: "Error uploading vehicle documents", error: error.message });
  }
};

const saveSchedule = async (req, res) => {
  try {
    await courierService.saveSchedule(req.body.userId, req.body);
    logger.info(`Schedule saved for ${req.body.userId}`);
    res.json({ message: "Schedule saved successfully" });
  } catch (error) {
    logger.error(
      `Error saving schedule for ${req.body.userId}: ${error.message}`
    );
    res.status(500).json({ message: "Error saving schedule", error: error.message });
  }
};

const updatePhone = async (req, res) => {
  const { newPhone, userId } = req.body;
  try {
    if (!(await checkCourierExists(phone))) {
      return res.status(404).json({ message: "Courier not found" });
    }

    await courierService.updatePhone(userId, newPhone);
    logger.info(`Phone number updated for ${userId}`);
    res.json({ message: "Phone number updated successfully" });
  } catch (error) {
    logger.error(`Error updating phone number for ${userId}: ${error.message}`);
    res.status(500).json({ message: "Error updating phone number", error: error.message });
  }
};

const updatePersonalDetails = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!(await checkCourierExistsByUserId(userId))) {
      return res.status(404).json({ message: "Courier not found" });
    }

    const updateFields = {};
    if (req.body.firstName) updateFields.firstName = req.body.firstName;
    if (req.body.lastName) updateFields.lastName = req.body.lastName;
    if (req.body.birthdate) updateFields.birthdate = req.body.birthdate;
    if (req.body.idNumber) updateFields.idNumber = req.body.idNumber;
    if (req.body.idExpiryDate)
      updateFields.idExpiryDate = req.body.idExpiryDate;
    if (req.body.driverLicenseIssueDate)
      updateFields.driverLicenseIssueDate = req.body.driverLicenseIssueDate;

    await courierService.updatePersonalDetails(userId, updateFields);
    logger.info(`Personal details updated for ${userId}`);
    res.json({ message: "Personal details updated successfully" });
  } catch (error) {
    logger.error(
      `Error updating personal details for ${userId}: ${error.message}`
    );
    res.status(500).json({ message: "Error updating personal details", error: error.message });
  }
};

const updatePickupSchedule = async (req, res) => {
  try {
    const { userId, pickupSchedule } = req.body;

    if (!(await checkCourierExistsByUserId(userId))) {
      return res.status(404).json({ message: "Courier not found" });
    }

    await courierService.updatePickupSchedule(userId, pickupSchedule);
    logger.info(`Pickup schedule updated for ${userId}`);
    res.json({ message: "Pickup schedule updated successfully" });
  } catch (error) {
    logger.error(
      `Error updating pickup schedule for ${userId}: ${error.message}`
    );
    res.status(500).json({ message: "Error updating pickup schedule", error: error.message });
  }
};

const updateDropoffSchedule = async (req, res) => {
  try {
    const { userId, dropoffSchedule } = req.body;

    if (!(await checkCourierExists(userId))) {
      return res.status(404).json({ message: "Courier not found" });
    }

    await courierService.updateDropoffSchedule(userId, dropoffSchedule);
    logger.info(`Dropoff schedule updated for ${userId}`);
    res.json({ message: "Dropoff schedule updated successfully" });
  } catch (error) {
    logger.error(
      `Error updating dropoff schedule for ${userId}: ${error.message}`
    );
    res.status(500).json({ message: "Error updating dropoff schedule", error: error.message });
  }
};

const addCourier = async (req, res) => {
  try {
    const newCourier = new Courier(req.body);
    await newCourier.save();
    logger.info(`Courier added successfully: ${newCourier.userId}`);
    res.status(201).json({ message: "Courier added successfully", courier: newCourier });
  } catch (error) {
    logger.error(`Error adding courier: ${error.message}`);
    res.status(500).json({ message: "Error adding courier", error: error.message });
  }
};

const viewAllCouriers = async (req, res) => {
  try {
    const couriers = await courierService.getAllCouriers();
    const activeCouriersCount = await Courier.countDocuments({ isActive: true });
    const governoratesCount = (await Courier.distinct("dropOffSchedule.governorate")).length;

    logger.info("Retrieved all couriers successfully");
    res.json({ couriers, activeCouriersCount, governoratesCount });
  } catch (error) {
    logger.error(`Error retrieving couriers: ${error.message}`);
    res.status(500).json({ message: "Error retrieving couriers", error: error.message });
  }
};

const editCourier = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCourier = await Courier.findOneAndUpdate({ userId: id }, req.body, { new: true });
    if (!updatedCourier) return res.status(404).json({ message: "Courier not found" });

    logger.info(`Courier updated successfully: ${updatedCourier.phone}`);
    res.json({ message: "Courier updated successfully", courier: updatedCourier });
  } catch (error) {
    logger.error(`Error updating courier: ${error.message}`);
    res.status(500).json({ message: "Error updating courier", error: error.message });
  }
};

const deleteCourier = async (req, res) => {
  try {
    const { id } = req.params;
    const courier = await Courier.findOneAndDelete({ userId: id });
    if (!courier) return res.status(404).json({ message: "Courier not found" });

    logger.info(`Courier deleted successfully: ${id}`);
    res.json({ message: "Courier deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting courier: ${error.message}`);
    res.status(500).json({ message: "Error deleting courier", error: error.message });
  }
};

module.exports = {
  requestOtp,
  verifyOtp,
  signUp,
  uploadDocuments,
  saveVehicleInfo,
  uploadVehicleDocuments,
  saveSchedule,
  updatePhone,
  updatePersonalDetails,
  updatePickupSchedule,
  updateDropoffSchedule,
  addCourier,
  viewAllCouriers,
  editCourier,
  deleteCourier,
};
