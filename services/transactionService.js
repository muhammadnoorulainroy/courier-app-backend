const Transaction = require("../models/transactionModel");

const getWalletStatement = async (phone) => {
  return await Transaction.find({ walletPhone: phone }).sort({ date: -1 });
};

const createTransaction = async (transactionData) => {
  const transaction = new Transaction(transactionData);
  return await transaction.save();
};

module.exports = {
  getWalletStatement,
  createTransaction
};
