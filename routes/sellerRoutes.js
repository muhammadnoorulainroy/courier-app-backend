const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/sellerController");
const validateRequest = require("../middlewares/validateRequest");
const {
  requestOtpSchema,
  verifyOtpSchema,
  personalInfoSchema,
} = require("../validators/sellerValidator");

router.post(
  "/sign-up",
  validateRequest(personalInfoSchema),
  sellerController.signUp
);
router.post(
  "/sign-in/request-otp",
  validateRequest(requestOtpSchema),
  sellerController.requestOtp
);
router.post(
  "/sign-in/verify-otp",
  validateRequest(verifyOtpSchema),
  sellerController.verifyOtp
);

module.exports = router;
