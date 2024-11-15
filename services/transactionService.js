const Transaction = require("../models/transactionModel");

const getAllTransactions = async (userId, walletId, filters = {}) => {
  const query = { ...filters };

  if (userId) query.userId = userId;
  if (walletId) query.walletId = walletId;

  return await Transaction.find(query).sort({ date: -1 });
};


const getWalletStatement = async (userId) => {
  console.log("userId", userId)
  return await Transaction.find({ userId: userId }).sort({ date: -1 });
};

const createTransaction = async (transactionData) => {
  const transaction = new Transaction(transactionData);
  return await transaction.save();
};

const updateTransaction = async (id, transactionData) => {
  return await Transaction.findByIdAndUpdate(id, transactionData, { new: true });
};

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
