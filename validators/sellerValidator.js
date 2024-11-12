const Joi = require("joi");

// Validation for requesting OTP (same as courier)
const requestOtpSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^[+][0-9]{10,15}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must be in international format starting with + and contain 10-15 digits.",
    }),
  purpose: Joi.string()
    .required()
    .valid("sign-in", "sign-up", "update-documents"),
});

// Validation for verifying OTP (same as courier)
const verifyOtpSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^[+][0-9]{10,15}$/)
    .required(),
  otp: Joi.string()
    .length(4)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.length": "OTP must be exactly 4 digits.",
      "string.pattern.base": "OTP must contain only numbers.",
    }),
});

// Validation for saving seller's personal information
const personalInfoSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^[+][0-9]{10,15}$/)
    .required(),
  firstName: Joi.string().min(2).max(50).required().messages({
    "string.min": "First name must be at least 2 characters.",
    "string.max": "First name cannot exceed 50 characters.",
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    "string.min": "Last name must be at least 2 characters.",
    "string.max": "Last name cannot exceed 50 characters.",
  }),
  businessName: Joi.string().min(2).max(100).required().messages({
    "string.min": "Business name must be at least 2 characters.",
    "string.max": "Business name cannot exceed 100 characters.",
  }),
});

const editSellerSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[A-Za-z\s]+$/),
  lastName: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[A-Za-z\s]+$/),
  phone: Joi.string().pattern(/^[+][1-9][0-9]{9,14}$/),
  financialPhone: Joi.string().pattern(/^[+][1-9][0-9]{9,14}$/),
  businessName: Joi.string()
    .min(2)
    .max(100)
    .pattern(/^[A-Za-z0-9\s'-.]+$/),
  isActive: Joi.boolean()
});

module.exports = {
  requestOtpSchema,
  verifyOtpSchema,
  personalInfoSchema,
  editSellerSchema,
};
