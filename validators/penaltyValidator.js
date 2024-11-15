const Joi = require("joi");

const penaltySchema = Joi.object({
  appliedTo: Joi.string()
    .pattern(/^[+][1-9][0-9]{9,14}$/)
    .required(),
  amount: Joi.number().min(0).required(),
  description: Joi.string().required(),
  reason: Joi.string()
    .valid("Manual", "SenderCancellation", "CourierCancellation")
    .required(),
});

const penaltyConfigSchema = Joi.object({
  senderCancellation: Joi.object({
    hoursBeforeShift: Joi.number().min(0).required(),
    penaltyAmount: Joi.number().min(0).required(),
  }).required(),
  courierCancellation: Joi.object({
    hoursAfterAcceptance: Joi.number().min(0).required(),
    penaltyAmount: Joi.number().min(0).required(),
  }).required(),
});

const validatePenalty = (req, res, next) => {
  const { error } = penaltySchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

const validatePenaltyConfig = (req, res, next) => {
  const { error } = penaltyConfigSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

module.exports = { validatePenalty, validatePenaltyConfig };
