const express = require('express');
const router = express.Router();
const validateRequest = require('../middleware/validateRequest');
const { requestOtpSchema, verifyOtpSchema, saveSellerInfoSchema } = require('../validators/authValidator');
const { requestOtp, saveSellerInfo, verifyOtp } = require('../controllers/authController');

// Route to request OTP
router.post('/request-otp', validateRequest(requestOtpSchema), requestOtp);

// Route to verify OTP
router.post('/verify-otp', validateRequest(verifyOtpSchema), verifyOtp);

// Route to save seller information after OTP verification
router.post('/save-seller', validateRequest(saveSellerInfoSchema), saveSellerInfo);

module.exports = router;
