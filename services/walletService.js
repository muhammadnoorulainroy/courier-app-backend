const Wallet = require("../models/walletModel");

const withdrawAmount = async (walletId, amount, accountDetails) => {
  const wallet = await Wallet.findOne({ walletId });

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
        walletId: 1,
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

const payDebt = async (walletId, amount, receiptPath) => {
  const wallet = await Wallet.findOne({ walletId });
  if (!wallet) throw new Error("Wallet not found");

  const transaction = {
    amount,
    type: "debt",
    status: "pending",
    receipt: receiptPath,
  };

  wallet.transactions.push(transaction);
  await wallet.save();

  return transaction;
};

const getWalletBalance = async (financialPhone) => {
  try {
    // Find the wallet by financialPhone
    const wallet = await Wallet.findOne({ financialPhone });

    // If no wallet is found, return null
    if (!wallet) {
      return null;
    }

    // Return the balance of the found wallet
    return wallet.balance;
  } catch (error) {
    throw new Error('Error retrieving wallet balance');
  }
};


module.exports = { withdrawAmount, getPendingTransactions, payDebt, getWalletBalance };
