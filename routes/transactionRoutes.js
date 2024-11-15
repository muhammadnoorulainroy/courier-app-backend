const express = require("express");
const transactionController = require("../controllers/transactionController");
const validateRequest = require("../middlewares/validateRequest");
const { transactionSchema } = require("../validators/transactionValidators");

const router = express.Router();

router.get("/", transactionController.getAllTransactions);
router.post("/", validateRequest(transactionSchema), transactionController.createTransaction);
router.put("/:id", validateRequest(transactionSchema), transactionController.updateTransaction);
router.delete("/:id", transactionController.deleteTransaction);
router.get('/statement/:userId', transactionController.getWalletStatement)

module.exports = router;