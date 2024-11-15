const Courier = require("../models/courierModel");
const { findUserByUserId } = require("./courierService");

const updatePersonalDocuments = async (userId, files) => {
  const user = await findUserByUserId(userId)
  if (!user) throw new Error("User not found")

  const updateData = {};
  [
    "idCardFront",
    "idCardBack",
    "driverLicenseFront",
    "driverLicenseBack",
  ].forEach((field) => {
    if (files[field]) updateData[field] = files[field][0].path;
  });
  return await Courier.updateOne({ userId }, { $set: updateData });
};

const updateVehicleDocuments = async (userId, files) => {
  const user = await findUserByUserId(userId)
  if (!user) throw new Error("User not found")

  const updateData = {};
  [
    "registrationCardFront",
    "registrationCardBack",
    "insuranceFront",
    "insuranceBack",
  ].forEach((field) => {
    if (files[field]) updateData[field] = files[field][0].path;
  });
  return await Courier.updateOne({ userId }, { $set: updateData });
};

module.exports = { updatePersonalDocuments, updateVehicleDocuments };
