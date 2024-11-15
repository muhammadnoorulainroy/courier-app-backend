const walletService = require("../services/walletService");
const otpService = require("../services/otpService");
const logger = require("../config/logger");

const requestOtp = async (req, res) => {
  const { phone, purpose } = req.body;
  const otp = otpService.generateOtp();

  try {
    await otpService.sendOtp(phone, otp);
    await otpService.saveOtp(phone, otp, "wallet", purpose);
    logger.info(`OTP sent successfully to ${phone}`);
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    logger.error(`Failed to send OTP to ${phone}: ${error.message}`);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

const verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  const { isValid, message } = await otpService.verifyOtp(phone, otp, "wallet");
  if (!isValid) {
    logger.warn(`OTP verification failed for ${phone}: ${message}`);
    return res.status(400).json({ message });
  }

  logger.info(`OTP verified successfully for ${phone}`);
  res.json({ message: "OTP verified" });
};

const withdrawAmount = async (req, res) => {
  const { walletId, amount, accountDetails } = req.body;

  try {
    const transaction = await walletService.withdrawAmount(walletId, amount, accountDetails);
    logger.info(`Withdrawal request of ${amount} created for wallet ID ${walletId}`);
    res.json({ message: "Withdrawal request created", transaction });
  } catch (error) {
    logger.error(`Error creating withdrawal request for wallet ID ${walletId}: ${error.message}`);
    res.status(500).json({ message: "Error creating withdrawal request" });
  }
};

const getPendingTransactions = async (req, res) => {
  try {
    const transactions = await walletService.getPendingTransactions();
    logger.info("Fetched all pending transactions");
    res.json({ transactions });
  } catch (error) {
    logger.error(`Error fetching pending transactions: ${error.message}`);
    res.status(500).json({ message: "Error fetching pending transactions" });
  }
};

const payDebt = async (req, res) => {
  try {
    const { walletId, amount } = req.body;
    const receiptPath = req.file ? req.file.path : null;

    const transaction = await walletService.payDebt(walletId, amount, receiptPath);
    logger.info(`Debt payment initiated for wallet ID ${walletId}`);
    res.status(201).json({ message: "Debt payment initiated", transaction });
  } catch (error) {
    logger.error(`Error processing debt payment for wallet ID ${req.body.walletId}: ${error.message}`);
    res.status(500).json({ message: "Error processing debt payment" });
  }
};

module.exports = {
  requestOtp,
  verifyOtp,
  withdrawAmount,
  getPendingTransactions,
  payDebt,
};
