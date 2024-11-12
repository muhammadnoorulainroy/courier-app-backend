const transactionService = require("../services/transactionService");
const logger = require("../config/logger");

const getWalletStatement = async (req, res) => {
  const { phone } = req.params;
  try {
    const statement = await transactionService.getWalletStatement(phone);
    logger.info(`Fetched statement for wallet ${phone}`);
    res.json({ statement });
  } catch (error) {
    logger.error(`Error fetching statement for wallet ${phone}: ${error.message}`);
    res.status(500).json({ message: "Error fetching wallet statement" });
  }
};

const createTransaction = async (req, res) => {
    try {
      const transactionData = req.body;
      const transaction = await transactionService.createTransaction(transactionData);
      logger.info(`Transaction created successfully with ID ${transaction._id}`);
      res.status(201).json({ message: "Transaction created successfully", transaction });
    } catch (error) {
      logger.error(`Error creating transaction: ${error.message}`);
      res.status(500).json({ message: "Error creating transaction" });
    }
  };
  
module.exports = {
  getWalletStatement,
  createTransaction
};
