const Joi = require("joi");

const notificationValidator = Joi.object({
  recipients: Joi.array()
    .items(
      Joi.object({
        recipientId: Joi.string().required(),
        recipientType: Joi.string().valid("Courier", "Seller", "Recipient").required(),
      })
    )
    .required(),
  title: Joi.string().min(3).max(100).required(),
  type: Joi.string().valid("Push", "Email", "SMS").required(),
  text: Joi.string().required(),
  button: Joi.object({
    title: Joi.string().optional(),
    color: Joi.string().optional(),
    link: Joi.string().optional().uri(),
  }).optional(),
  schedule: Joi.object({
    date: Joi.date().required(),
    time: Joi.string()
      .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .required(),
  }).optional(),
  repeat: Joi.object({
    date: Joi.date().optional(),
    days: Joi.number().optional(),
    hours: Joi.number().optional(),
    minutes: Joi.number().optional(),
  }).optional(),
  status: Joi.string().valid("Pending", "Scheduled", "Sent").optional(),
});

module.exports = {
  notificationValidator,
};
