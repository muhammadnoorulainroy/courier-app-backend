const Joi = require("joi");

// Validation for requesting OTP
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
      "string.length": "OTP must be exactly 4 digits.",
      "string.pattern.base": "OTP must contain only numbers.",
    }),
});

// Validation for saving personal information
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
  birthdate: Joi.date().required(),
  idNumber: Joi.string().required(),
  idExpiryDate: Joi.date().required(),
  driverLicenseIssueDate: Joi.date().required(),
});

// Validation for saving vehicle information
const vehicleInfoSchema = Joi.object({
  userId: Joi.string().required(),
  vehicleBrand: Joi.string().min(2).max(50).required(),
  vehicleModel: Joi.string().min(1).max(50).required(),
  vehicleYear: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .required(),
  fuelType: Joi.string()
    .valid("Petrol", "Diesel", "Electric", "Hybrid")
    .required(),
  insuranceType: Joi.string().min(3).max(50).required(),
  insuranceExpiryDate: Joi.date().required(),
  registrationExpiryDate: Joi.date().required(),
});

// Validation for saving schedule information
const scheduleSchema = Joi.object({
  userId: Joi.string().required(),
  dropOffSchedule: Joi.array()
    .items(
      Joi.object({
        governorate: Joi.string().required(),
        days: Joi.array().items(
          Joi.string().valid(
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          )
        ),
        startHour: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
        finishHour: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
      })
    )
    .required(),
  pickUpSchedule: Joi.array()
    .items(
      Joi.object({
        governorate: Joi.string().required(),
        days: Joi.array().items(
          Joi.string().valid(
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          )
        ),
        startHour: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
        finishHour: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
      })
    )
    .required(),
});

const updatePhoneSchema = Joi.object({
  userId: Joi.string().required(),
  phone: Joi.string()
  .pattern(/^[+][0-9]{10,15}$/)
  .required(),
  newPhone: Joi.string()
  .pattern(/^[+][0-9]{10,15}$/)
  .required()
});

const pickupScheduleSchema = Joi.object({
  userId: Joi.string().required(),
  pickupSchedule: Joi.array().items(
    Joi.object({
      governorate: Joi.string().required(),
      days: Joi.array().items(
        Joi.string().valid(
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        )
      ).required(),
      startHour: Joi.string()
        .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .required(),
      finishHour: Joi.string()
        .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .required(),
    })
  ).required(),
});

const dropoffScheduleSchema = Joi.object({
  userId: Joi.string().required(),
  dropoffSchedule: Joi.array().items(
    Joi.object({
      governorate: Joi.string().required(),
      days: Joi.array().items(
        Joi.string().valid(
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        )
      ).required(),
      startHour: Joi.string()
        .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .required(),
      finishHour: Joi.string()
        .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .required(),
    })
  ).required(),
});

const updatePersonalDetailsSchema = Joi.object({
  userId: Joi.string().required(),
  phone: Joi.string().required(),
  firstName: Joi.string().min(2).max(50).pattern(/^[A-Za-z\s]+$/).optional(),
  lastName: Joi.string().min(2).max(50).pattern(/^[A-Za-z\s]+$/).optional(),
  birthdate: Joi.date().optional(),
  idNumber: Joi.string().optional(),
  idExpiryDate: Joi.date().optional(),
  driverLicenseIssueDate: Joi.date().optional(),
});

module.exports = {
  requestOtpSchema,
  verifyOtpSchema,
  personalInfoSchema,
  vehicleInfoSchema,
  scheduleSchema,
  pickupScheduleSchema,
  dropoffScheduleSchema,
  updatePersonalDetailsSchema,
  updatePhoneSchema
};
