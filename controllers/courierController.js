const otpService = require("../services/otpService");
const courierService = require("../services/courierService");
const documentService = require("../services/documentService");
const Courier = require("../models/courierModel");
const jwt = require("jsonwebtoken");
const logger = require("../config/logger");

const checkCourierExists = async (phone) => {
  const courier = await courierService.findUserByPhone(phone);
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

  const { isValid, message, purpose } = await otpService.verifyOtp(
    phone,
    otp,
    "courier"
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
  res.json({ message: "OTP verified", token });
};

const signUp = async (req, res) => {
  try {
    await courierService.savePersonalInfo(req.body);
    logger.info(`Personal information saved for ${req.body.phone}`);
    res.json({ message: "Personal information saved" });
  } catch (error) {
    logger.error(
      `Error saving personal information for ${req.body.phone}: ${error.message}`
    );
    res.status(500).json({ message: "Error saving personal information" });
  }
};

const uploadDocuments = async (req, res) => {
  try {
    await documentService.updatePersonalDocuments(req.body.phone, req.files);
    logger.info(`Personal documents uploaded for ${req.body.phone}`);
    res.json({ message: "Documents uploaded successfully" });
  } catch (error) {
    logger.error(
      `Error uploading documents for ${req.body.phone}: ${error.message}`
    );
    res.status(500).json({ message: "Error uploading documents" });
  }
};

const saveVehicleInfo = async (req, res) => {
  try {
    await courierService.saveVehicleInfo(req.body.phone, req.body);
    logger.info(`Vehicle information saved for ${req.body.phone}`);
    res.json({ message: "Vehicle information saved" });
  } catch (error) {
    logger.error(
      `Error saving vehicle information for ${req.body.phone}: ${error.message}`
    );
    res.status(500).json({ message: "Error saving vehicle information" });
  }
};

const uploadVehicleDocuments = async (req, res) => {
  try {
    await documentService.updateVehicleDocuments(req.body.phone, req.files);
    logger.info(`Vehicle documents uploaded for ${req.body.phone}`);
    res.json({ message: "Vehicle documents uploaded successfully" });
  } catch (error) {
    logger.error(
      `Error uploading vehicle documents for ${req.body.phone}: ${error.message}`
    );
    res.status(500).json({ message: "Error uploading vehicle documents" });
  }
};

const saveSchedule = async (req, res) => {
  try {
    await courierService.saveSchedule(req.body.phone, req.body);
    logger.info(`Schedule saved for ${req.body.phone}`);
    res.json({ message: "Schedule saved successfully" });
  } catch (error) {
    logger.error(
      `Error saving schedule for ${req.body.phone}: ${error.message}`
    );
    res.status(500).json({ message: "Error saving schedule" });
  }
};

const updatePhone = async (req, res) => {
  const { phone, newPhone } = req.body;
  try {
    if (!(await checkCourierExists(phone))) {
      return res.status(404).json({ message: "Courier not found" });
    }

    await courierService.updatePhone(phone, newPhone);
    logger.info(`Phone number updated for ${phone}`);
    res.json({ message: "Phone number updated successfully" });
  } catch (error) {
    logger.error(`Error updating phone number for ${phone}: ${error.message}`);
    res.status(500).json({ message: "Error updating phone number" });
  }
};

const updatePersonalDetails = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!(await checkCourierExists(phone))) {
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

    await courierService.updatePersonalDetails(phone, updateFields);
    logger.info(`Personal details updated for ${phone}`);
    res.json({ message: "Personal details updated successfully" });
  } catch (error) {
    logger.error(
      `Error updating personal details for ${phone}: ${error.message}`
    );
    res.status(500).json({ message: "Error updating personal details" });
  }
};

const updatePickupSchedule = async (req, res) => {
  try {
    const { phone, pickupSchedule } = req.body;

    if (!(await checkCourierExists(phone))) {
      return res.status(404).json({ message: "Courier not found" });
    }

    await courierService.updatePickupSchedule(phone, pickupSchedule);
    logger.info(`Pickup schedule updated for ${phone}`);
    res.json({ message: "Pickup schedule updated successfully" });
  } catch (error) {
    logger.error(
      `Error updating pickup schedule for ${phone}: ${error.message}`
    );
    res.status(500).json({ message: "Error updating pickup schedule" });
  }
};

const updateDropoffSchedule = async (req, res) => {
  try {
    const { phone, dropoffSchedule } = req.body;

    if (!(await checkCourierExists(phone))) {
      return res.status(404).json({ message: "Courier not found" });
    }

    await courierService.updateDropoffSchedule(phone, dropoffSchedule);
    logger.info(`Dropoff schedule updated for ${phone}`);
    res.json({ message: "Dropoff schedule updated successfully" });
  } catch (error) {
    logger.error(
      `Error updating dropoff schedule for ${phone}: ${error.message}`
    );
    res.status(500).json({ message: "Error updating dropoff schedule" });
  }
};

const addCourier = async (req, res) => {
  try {
    const newCourier = new Courier(req.body);
    await newCourier.save();
    logger.info(`Courier added successfully: ${newCourier.phone}`);
    res
      .status(201)
      .json({ message: "Courier added successfully", courier: newCourier });
  } catch (error) {
    logger.error(`Error adding courier: ${error.message}`);
    res.status(500).json({ message: "Error adding courier" });
  }
};

const viewAllCouriers = async (req, res) => {
  try {
    const couriers = await courierService.getAllCouriers();
    const activeCouriersCount = await Courier.countDocuments({
      isActive: true,
    });
    const governoratesCount = await Courier.distinct(
      "dropOffSchedule.governorate"
    ).length;

    logger.info("Retrieved all couriers successfully");
    res.json({ couriers, activeCouriersCount, governoratesCount });
  } catch (error) {
    logger.error(`Error retrieving couriers: ${error.message}`);
    res.status(500).json({ message: "Error retrieving couriers" });
  }
};

const editCourier = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCourier = await Courier.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    logger.info(`Courier updated successfully: ${updatedCourier.phone}`);
    res.json({
      message: "Courier updated successfully",
      courier: updatedCourier,
    });
  } catch (error) {
    logger.error(`Error updating courier: ${error.message}`);
    res.status(500).json({ message: "Error updating courier" });
  }
};

const deleteCourier = async (req, res) => {
  try {
    const { id } = req.params;
    await Courier.findByIdAndDelete(id);
    logger.info(`Courier deleted successfully: ${id}`);
    res.json({ message: "Courier deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting courier: ${error.message}`);
    res.status(500).json({ message: "Error deleting courier" });
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
