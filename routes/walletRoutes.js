const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");
const validateRequest = require("../middlewares/validateRequest");
const {
  requestOtpSchema,
  verifyOtpSchema,
  withdrawRequestSchema,
} = require("../validators/walletValidator");

router.post(
  "/request-otp",
  validateRequest(requestOtpSchema),
  walletController.requestOtp
);

router.post(
  "/verify-otp",
  validateRequest(verifyOtpSchema),
  walletController.verifyOtp
);

router.post(
  "/withdraw",
  validateRequest(withdrawRequestSchema),
  walletController.withdrawAmount
);

router.get("/pending-transactions", walletController.getPendingTransactions);

module.exports = router;
