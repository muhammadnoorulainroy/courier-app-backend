const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const validateRequest = require("../middlewares/validateRequest");
const { phoneSchema } = require("../validators/walletValidator");
const { createTransactionSchema } = require("../validators/transactionValidators");

router.get(
  "/:phone/statement",
  validateRequest(phoneSchema, "params"),
  transactionController.getWalletStatement
);

router.post(
  "/create",
  validateRequest(createTransactionSchema),
  transactionController.createTransaction
);

module.exports = router;
