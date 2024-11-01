const Joi = require('joi');

const createAddressSchema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    phone: Joi.string().pattern(/^[+][0-9]{10,15}$/).required(),
    whatsapp: Joi.string().pattern(/^[+][0-9]{10,15}$/).optional(),
    district: Joi.string().required(),
    streetName: Joi.string().required(),
    buildingNumber: Joi.string().required(),
    floorNumber: Joi.string().optional(),
    apartmentNumber: Joi.string().optional(),
    closestLandmark: Joi.string().optional(),
    locationLink: Joi.string().optional(),
    isSaved: Joi.boolean().optional()
});

module.exports = { createAddressSchema };
