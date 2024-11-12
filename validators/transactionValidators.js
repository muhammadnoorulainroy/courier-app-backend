const Joi = require("joi");

const createTransactionSchema = Joi.object({
  walletPhone: Joi.string()
    .pattern(/^[+][1-9][0-9]{9,14}$/)
    .required(),
  type: Joi.string().valid("debit", "credit").required(),
  amount: Joi.number().positive().required(),
  description: Joi.string().required(),
  trackingId: Joi.string().required(),
});

module.exports = {
  createTransactionSchema,
};
