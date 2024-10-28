const Joi = require('joi');

// Validation for requesting OTP
const requestOtpSchema = Joi.object({
    phone: Joi.string()
        .pattern(/^[+][0-9]{10,15}$/)
        .required()
        .messages({
            'string.pattern.base': 'Phone number must be in international format starting with + and contain 10-15 digits.'
        })
});

// Validation for verifying OTP
const verifyOtpSchema = Joi.object({
    phone: Joi.string()
        .pattern(/^[+][0-9]{10,15}$/)
        .required(),
    otp: Joi.string()
        .length(4)
        .pattern(/^[0-9]+$/)
        .required()
        .messages({
            'string.length': 'OTP must be exactly 4 digits.',
            'string.pattern.base': 'OTP must contain only numbers.'
        })
});

// Validation for saving seller info
const saveSellerInfoSchema = Joi.object({
    phone: Joi.string()
        .pattern(/^[+][0-9]{10,15}$/)
        .required(),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    businessName: Joi.string().min(2).max(100).required()
});

module.exports = {
    requestOtpSchema,
    verifyOtpSchema,
    saveSellerInfoSchema
};
