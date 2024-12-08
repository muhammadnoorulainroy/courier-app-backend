const Joi = require("joi");

const addressSchema = Joi.object({
  district: Joi.string().required(),
  streetName: Joi.string().required(),
  buildingNumber: Joi.string().required(),
  floorNumber: Joi.string().optional(),
  apartmentNumber: Joi.string().optional(),
  closestLandmark: Joi.string().optional(),
  locationLink: Joi.string().optional(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  governorate: Joi.string().required(),
});

const recipientSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string()
    .pattern(/^[+][0-9]{10,15}$/)
    .required(),
  whatsapp: Joi.string()
    .pattern(/^[+][0-9]{10,15}$/)
    .optional(),
});

const createShipmentSchema = Joi.object({
  senderId: Joi.string().required(),
  recipientId: Joi.string().required(),
  type: Joi.string().valid("Piece", "Bulk").required(),
  weight: Joi.number().required(),
  dimensions: Joi.object({
    length: Joi.number().required(),
    height: Joi.number().required(),
    width: Joi.number().required(),
  }).required(),
  pickUpDetails: Joi.object({
    date: Joi.date().required(),
    time: Joi.string().required(),
    location: addressSchema,
  }).required(),
  dropOffDetails: Joi.object({
    date: Joi.date().required(),
    time: Joi.string().required(),
    recipient: recipientSchema.required(),
    location: addressSchema,
  }).required(),
  paymentDetails: Joi.object({
    initialAmount: Joi.number().required(),
    finalAmount: Joi.number().optional(),
  }).required(),
  needCooling: Joi.boolean().optional(), // New field for parcels requiring cooling
  isFragile: Joi.boolean().optional(), // New field for fragile parcels
});

const paymentSchema = Joi.object({
  shipmentId: Joi.string().required(),
  status: Joi.string().valid("Pending", "Completed").required(),
});

module.exports = { createShipmentSchema, paymentSchema };
