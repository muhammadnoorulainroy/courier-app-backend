const logger = require("../config/logger");
const Shift = require("../models/shiftModel");
const Shipment = require("../models/shipmentModel");
const Transaction = require("../models/transactionModel");
const Wallet = require("../models/walletModel");

const PENALTY_PER_PENDING_DELIVERY = 3;

// Start Shift
const startShift = async (courierPhone) => {
  // Check for active shift
  const activeShift = await Shift.findOne({ courierPhone, status: "active" });
  if (activeShift) {
    throw new Error("You already have an active shift.");
  }

  // Start new shift
  const shift = new Shift({ courierPhone, startTime: new Date() });
  await shift.save();
  return shift;
};

const endShift = async (courierPhone) => {
  const shift = await Shift.findOne({ courierPhone, status: "active" });
  if (!shift) throw new Error("No active shift found.");

  // Check for pending shipments
  const pendingDeliveries = await Shipment.countDocuments({
    courierPhone: courierPhone,
    status: { $ne: "delivered" },
  });

  shift.endTime = new Date();
  shift.status = "completed";
  shift.pendingDeliveries = pendingDeliveries;

  if (pendingDeliveries > 0) {
    const penalty = pendingDeliveries * PENALTY_PER_PENDING_DELIVERY;
    shift.penalty = penalty;

    // Deduct penalty from wallet and create transaction entry
    const wallet = await Wallet.findOne({ phone: courierPhone });
    if (!wallet) throw new Error("Wallet not found for the specified courier.");

    // Update wallet balance
    wallet.balance -= penalty;

    // Add transaction entry to the wallet's transactions array
    const walletTransaction = {
      trackingId: `PEN-${new Date().getTime()}`, // Unique identifier for penalty transaction
      amount: -penalty,
      type: "debit",
      description: `Penalty for ${pendingDeliveries} pending deliveries`,
    };
    wallet.transactions.push(walletTransaction);
    await wallet.save();

    // Create a separate transaction document
    await Transaction.create({
      walletPhone: courierPhone,
      trackingId: walletTransaction.trackingId,
      amount: -penalty,
      type: "debit",
      description: `Penalty for ${pendingDeliveries} pending deliveries`,
      date: new Date(),
    });

    logger.info(
      `Penalty of ${penalty} JOD applied for ${pendingDeliveries} pending deliveries for courier ${courierPhone}`
    );
  }

  await shift.save();
  logger.info(
    `Shift ended for courier ${courierPhone} with ${pendingDeliveries} pending deliveries`
  );
  return shift;
};

module.exports = { startShift, endShift };
