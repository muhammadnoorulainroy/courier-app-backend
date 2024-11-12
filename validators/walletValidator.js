const Joi = require("joi");

const requestOtpSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^[+][1-9][0-9]{9,14}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must start with + and contain 10-15 digits.",
      "any.required": "Phone number is required."
    }),
  purpose: Joi.string().valid("transaction").required().messages({
    "any.only": "Purpose must be 'transaction' for wallet operations.",
    "any.required": "Purpose is required."
  }),
});

const verifyOtpSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^[+][1-9][0-9]{9,14}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must start with + and contain 10-15 digits.",
      "any.required": "Phone number is required."
    }),
  otp: Joi.string()
    .length(4)
    .pattern(/^\d+$/)
    .required()
    .messages({
      "string.length": "OTP must be a 4-digit number.",
      "string.pattern.base": "OTP must be numeric.",
      "any.required": "OTP is required."
    }),
});

const withdrawRequestSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^[+][1-9][0-9]{9,14}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must start with + and contain 10-15 digits.",
      "any.required": "Phone number is required."
    }),
  amount: Joi.number().positive().required().messages({
    "number.positive": "Amount must be a positive number.",
    "any.required": "Amount is required."
  }),
  accountDetails: Joi.object({
    accountType: Joi.string().valid("bank", "e-wallet").required().messages({
      "any.only": "Account type must be either 'bank' or 'e-wallet'.",
      "any.required": "Account type is required."
    }),
    serviceProvider: Joi.string().required().messages({
      "any.required": "Service provider is required."
    }),
    branch: Joi.string().optional().allow(null, "").messages({
      "string.base": "Branch must be a string."
    }),
    iban: Joi.string().optional().allow(null, "").messages({
      "string.base": "IBAN must be a string."
    }),
    accountOwnerName: Joi.string().required().messages({
      "any.required": "Account owner name is required."
    })
  }).required().messages({
    "any.required": "Account details are required."
  })
});

const phoneSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^[+][1-9][0-9]{9,14}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must start with + and contain 10-15 digits.",
    }),
});


module.exports = {
  requestOtpSchema,
  verifyOtpSchema,
  withdrawRequestSchema,
  phoneSchema
};
