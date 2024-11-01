const Courier = require("../models/courierModel");

const savePersonalInfo = async (personalInfo) => {
  return await Courier.updateOne({ phone: personalInfo.phone }, personalInfo, {
    upsert: true,
  });
};

const saveVehicleInfo = async (phone, vehicleInfo) => {
  return await Courier.updateOne({ phone }, { $set: vehicleInfo });
};

const saveSchedule = async (phone, schedules) => {
  return await Courier.updateOne(
    { phone },
    {
      $set: {
        dropOffSchedule: schedules.dropOffSchedule,
        pickUpSchedule: schedules.pickUpSchedule,
      },
    }
  );
};

const findUserByPhone = async (phone) => {
  return await Courier.findOne({ phone });
};


const updatePhone = async (phone, newPhone) => {
  return await Courier.updateOne({ phone }, { phone: newPhone });
};

const updatePersonalDetails = async (phone, updateFields) => {
  return await Courier.updateOne({ phone }, { $set: updateFields });
};

const updatePickupSchedule = async (phone, pickupSchedule) => {
  return await Courier.updateOne(
    { phone },
    { $set: { pickUpSchedule: pickupSchedule } }
  );
};

const updateDropoffSchedule = async (phone, dropoffSchedule) => {
  return await Courier.updateOne(
    { phone },
    { $set: { dropOffSchedule: dropoffSchedule } }
  );
};



module.exports = {
  savePersonalInfo,
  findUserByPhone,
  saveVehicleInfo,
  saveSchedule,
  updatePhone,
  updatePersonalDetails,
  updatePickupSchedule,
  updateDropoffSchedule
};
