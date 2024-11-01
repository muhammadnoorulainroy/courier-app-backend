const express = require("express");
const router = express.Router();
const courierController = require("../controllers/courierController");
const validateRequest = require("../middlewares/validateRequest");
const {
  requestOtpSchema,
  verifyOtpSchema,
  personalInfoSchema,
  vehicleInfoSchema,
  scheduleSchema,
  dropoffScheduleSchema,
  pickupScheduleSchema,
  updatePersonalDetailsSchema,
  updatePhoneSchema,
} = require("../validators/courierValidator");
const upload = require("../middlewares/upload");

router.post(
  "/sign-up",
  validateRequest(personalInfoSchema),
  courierController.signUp
);
router.post(
  "/sign-in/request-otp",
  validateRequest(requestOtpSchema),
  courierController.requestOtp
);
router.post(
  "/sign-in/verify-otp",
  validateRequest(verifyOtpSchema),
  courierController.verifyOtp
);
router.post(
  "/upload-documents",
  upload.fields([
    { name: "idCardFront", maxCount: 1 },
    { name: "idCardBack", maxCount: 1 },
    { name: "driverLicenseFront", maxCount: 1 },
    { name: "driverLicenseBack", maxCount: 1 },
  ]),
  courierController.uploadDocuments
);

router.post(
  "/save-vehicle-info",
  validateRequest(vehicleInfoSchema),
  courierController.saveVehicleInfo
);
router.post(
  "/upload-vehicle-documents",
  upload.fields([
    { name: "registrationCardFront", maxCount: 1 },
    { name: "registrationCardBack", maxCount: 1 },
    { name: "insuranceFront", maxCount: 1 },
    { name: "insuranceBack", maxCount: 1 },
  ]),
  courierController.uploadVehicleDocuments
);

router.post(
  "/save-schedule",
  validateRequest(scheduleSchema),
  courierController.saveSchedule
);

router.put(
  "/update-phone",
  validateRequest(updatePhoneSchema),
  courierController.updatePhone
);
router.put(
  "/update-personal-details",
  validateRequest(updatePersonalDetailsSchema),
  courierController.updatePersonalDetails
);

router.put(
  "/update-pickup-schedule",
  validateRequest(pickupScheduleSchema),
  courierController.updatePickupSchedule
);
router.put(
  "/update-dropoff-schedule",
  validateRequest(dropoffScheduleSchema),
  courierController.updateDropoffSchedule
);

module.exports = router;
