const Joi = require("joi");

const addAdminSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).regex(/^[A-Za-z\s]+$/).required()
    .messages({
      "string.base": "First name must be a string",
      "string.empty": "First name cannot be empty",
      "string.min": "First name must be at least 2 characters",
      "string.max": "First name cannot exceed 50 characters",
      "any.required": "First name is required",
      "string.pattern.base": "First name can only contain letters and spaces"
    }),
  lastName: Joi.string().min(2).max(50).regex(/^[A-Za-z\s]+$/).required()
    .messages({
      "string.base": "Last name must be a string",
      "string.empty": "Last name cannot be empty",
      "string.min": "Last name must be at least 2 characters",
      "string.max": "Last name cannot exceed 50 characters",
      "any.required": "Last name is required",
      "string.pattern.base": "Last name can only contain letters and spaces"
    }),
  email: Joi.string().email().required()
    .messages({
      "string.email": "Please enter a valid email address",
      "any.required": "Email is required"
    }),
  position: Joi.string().min(2).required()
    .messages({
      "string.base": "Position must be a string",
      "string.empty": "Position cannot be empty",
      "string.min": "Position must be at least 2 characters",
      "any.required": "Position is required"
    }),
  password: Joi.string().min(6).required()
    .messages({
      "string.base": "Password must be a string",
      "string.empty": "Password cannot be empty",
      "string.min": "Password must be at least 6 characters",
      "any.required": "Password is required"
    }),
  permissions: Joi.object({
    dashboard: Joi.boolean(),
    adminUsers: Joi.boolean(),
    notifications: Joi.boolean(),
    senders: Joi.boolean(),
    couriers: Joi.boolean(),
    recipients: Joi.boolean(),
    shipments: Joi.boolean(),
    promocodes: Joi.boolean(),
    transactions: Joi.boolean(),
    penalties: Joi.boolean(),
    finance: Joi.boolean(),
    reports: Joi.boolean(),
    cliQ: Joi.boolean()
  })
});

const updateAdminSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).regex(/^[A-Za-z\s]+$/),
  lastName: Joi.string().min(2).max(50).regex(/^[A-Za-z\s]+$/),
  email: Joi.string().email(),
  position: Joi.string().min(2),
  isActive: Joi.boolean(),
  permissions: Joi.object({
    dashboard: Joi.boolean(),
    adminUsers: Joi.boolean(),
    notifications: Joi.boolean(),
    senders: Joi.boolean(),
    couriers: Joi.boolean(),
    recipients: Joi.boolean(),
    shipments: Joi.boolean(),
    promocodes: Joi.boolean(),
    transactions: Joi.boolean(),
    penalties: Joi.boolean(),
    finance: Joi.boolean(),
    reports: Joi.boolean(),
    cliQ: Joi.boolean()
  })
}).min(1); // Require at least one field for update

module.exports = { addAdminSchema, updateAdminSchema };
