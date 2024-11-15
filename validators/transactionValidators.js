const Joi = require("joi");

const transactionSchema = Joi.object({
  walletPhone: Joi.string()
    .pattern(/^[+][1-9][0-9]{9,14}$/)
    .required(),
  type: Joi.string().valid("debit", "credit").required(),
  amount: Joi.number().positive().required(),
  inOut: Joi.string().valid("In", "Out", "Pass-through").required(),
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
});

module.exports = { transactionSchema };
