const Wallet = require("../models/walletModel");

const withdrawAmount = async (phone, amount, accountDetails) => {
  const wallet = await Wallet.findOne({ phone });

  if (!wallet) throw new Error("Wallet not found");
  if (wallet.balance < amount) throw new Error("Insufficient balance");

  const transaction = {
    amount,
    type: "withdrawal",
    status: "pending",
    accountDetails,
  };

  wallet.transactions.push(transaction);
  wallet.balance -= amount;
  await wallet.save();

  return transaction;
};

const getPendingTransactions = async () => {
  return await Wallet.aggregate([
    {
      $project: {
        phone: 1,
        pendingTransactions: {
          $filter: {
            input: "$transactions",
            as: "transaction",
            cond: { $eq: ["$$transaction.status", "pending"] },
          },
        },
      },
    },
    {
      $match: {
        "pendingTransactions.0": { $exists: true },
      },
    },
  ]);
};

const payDebt = async (phone, amount, receiptPath) => {
  const wallet = await Wallet.findOne({ phone });
  if (!wallet) throw new Error("Wallet not found");

  const transaction = {
    amount: amount,
    type: "debt",
    status: "pending",
    receipt: receiptPath,
  };

  wallet.transactions.push(transaction);
  await wallet.save();

  return transaction;
};

module.exports = { withdrawAmount, getPendingTransactions, payDebt };
