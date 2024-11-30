const Joi = require("joi");

const transactionSchema = Joi.object({
  walletId: Joi.string().required(), // Required as it's an ObjectId reference to Wallet
  userId: Joi.string().required(),
  type: Joi.string().valid("debit", "credit").required(),
  amount: Joi.number().positive().required(),
  inOut: Joi.string().valid("In", "Out", "Pass-through").required(),
  fees: Joi.number().default(0), // Optional, default to 0 if not provided
  reason: Joi.string()
    .valid(
      "Delivery Payment",
      "Refund",
      "Penalty",
      "Bonus",
      "Fees",
      "Promocode",
      "POD",
      "Other"
    )
    .required(),
  description: Joi.string().required(),
  trackingId: Joi.string().optional(),
  date: Joi.date().optional(),
  penaltyDetails: Joi.string().optional(), // Reference to Penalty (ObjectId)
  shipmentDetails: Joi.string().optional(), // Reference to Shipment (ObjectId)
  promocodeUsed: Joi.string().valid("Yes", "No").optional(), // Yes/No, based on the updated model
  promoSavings: Joi.number().optional(), // Total promo savings
});

module.exports = { transactionSchema };
