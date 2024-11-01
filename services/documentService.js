const Courier = require("../models/courierModel");

const updatePersonalDocuments = async (phone, files) => {
  const updateData = {};
  [
    "idCardFront",
    "idCardBack",
    "driverLicenseFront",
    "driverLicenseBack",
  ].forEach((field) => {
    if (files[field]) updateData[field] = files[field][0].path;
  });
  return await Courier.updateOne({ phone }, { $set: updateData });
};

const updateVehicleDocuments = async (phone, files) => {
  const updateData = {};
  [
    "registrationCardFront",
    "registrationCardBack",
    "insuranceFront",
    "insuranceBack",
  ].forEach((field) => {
    if (files[field]) updateData[field] = files[field][0].path;
  });
  return await Courier.updateOne({ phone }, { $set: updateData });
};

module.exports = { updatePersonalDocuments, updateVehicleDocuments };
