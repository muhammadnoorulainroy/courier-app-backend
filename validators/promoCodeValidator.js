const Joi = require("joi");

const promoCodeSchema = Joi.object({
  promoCode: Joi.string().trim().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  startTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({ "string.pattern.base": "Start time must be in HH:mm format" }),
  endTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({ "string.pattern.base": "End time must be in HH:mm format" }),
  maxUses: Joi.number().integer().min(1).required(),
  promoCodeType: Joi.string().valid("Percentage", "Fixed Amount", "BOGO").required(),
  details: Joi.object({
    percentage: Joi.number()
      .when("..promoCodeType", { is: "Percentage", then: Joi.required() })
      .min(1)
      .max(100),
    maxUsesPerUser: Joi.number().integer().min(1),
    cap: Joi.number().min(0),
  }),
  governoratesFrom: Joi.array().items(Joi.string()).required(),
  governoratesTo: Joi.array().items(Joi.string()).required(),
  paymentMethod: Joi.string().required(),
  usersTargeted: Joi.object({
    allUsers: Joi.boolean(),
    specificUsers: Joi.array().items(
      Joi.string().pattern(/^[+][0-9]{10,15}$/).message("Phone number must be in international format")
    ),
  }),
  minOrderAmount: Joi.number().min(0),
  status: Joi.boolean(),
});

module.exports = { promoCodeSchema };
