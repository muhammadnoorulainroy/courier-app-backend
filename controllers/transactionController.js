const transactionService = require("../services/transactionService");
const logger = require("../config/logger");

const getAllTransactions = async (req, res) => {
  try {
    const { userId, walletId, ...filters } = req.query; // Extract userId and walletId if provided
    const transactions = await transactionService.getAllTransactions(userId, walletId, filters);
    logger.info("Fetched all transactions");
    res.status(200).json({ transactions });
  } catch (error) {
    logger.error(`Error fetching transactions: ${error.message}`);
    res.status(500).json({ message: "Error fetching transactions" });
  }
};

const getWalletStatement = async (req, res) => {
  const { userId } = req.params;
  try {
    const statement = await transactionService.getWalletStatement(userId);
    logger.info(`Fetched statement for wallet ${userId}`);
    res.json({ statement });
  } catch (error) {
    logger.error(`Error fetching statement for wallet ${userId}: ${error.message}`);
    res.status(500).json({ message: "Error fetching wallet statement", error: error.message });
  }
};

const createTransaction = async (req, res) => {
  try {
    const transaction = await transactionService.createTransaction(req.body);
    logger.info("Transaction created successfully");
    res.status(201).json({ message: "Transaction created successfully", transaction });
  } catch (error) {
    logger.error(`Error creating transaction: ${error.message}`);
    res.status(500).json({ message: "Error creating transaction" });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const transaction = await transactionService.updateTransaction(req.params.id, req.body);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    logger.info("Transaction updated successfully");
    res.status(200).json({ message: "Transaction updated successfully", transaction });
  } catch (error) {
    logger.error(`Error updating transaction: ${error.message}`);
    res.status(500).json({ message: "Error updating transaction" });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const transaction = await transactionService.deleteTransaction(req.params.id);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    logger.info("Transaction deleted successfully");
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting transaction: ${error.message}`);
    res.status(500).json({ message: "Error deleting transaction" });
  }
};

module.exports = {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getWalletStatement
};
