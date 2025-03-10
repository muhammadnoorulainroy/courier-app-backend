const Transaction = require("../models/transactionModel");

// Get all transactions based on filters
const getAllTransactions = async (userId, walletId, filters = {}) => {
  const query = { ...filters };

  if (userId) query.userId = userId;
  if (walletId) query.walletId = walletId;

  return await Transaction.find(query).sort({ date: -1 });
};

// Get wallet statement for a specific user
const getWalletStatement = async (userId) => {
  return await Transaction.find({ userId: userId }).sort({ date: -1 });
};

// Create a new transaction
const createTransaction = async (transactionData) => {
  const transaction = new Transaction(transactionData);
  return await transaction.save();
};

// Update a transaction by ID
const updateTransaction = async (id, transactionData) => {
  return await Transaction.findByIdAndUpdate(id, transactionData, { new: true });
};

// Delete a transaction by ID
const deleteTransaction = async (id) => {
  return await Transaction.findByIdAndDelete(id);
};

module.exports = {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getWalletStatement
};
