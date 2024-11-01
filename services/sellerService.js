const Seller = require("../models/sellerModel");

const savePersonalInfo = async (personalInfo) => {
  return await Seller.updateOne({ phone: personalInfo.phone }, personalInfo, {
    upsert: true,
  });
};

const findUserByPhone = async (phone) => {
  return await Seller.findOne({ phone });
};

module.exports = { savePersonalInfo, findUserByPhone };
