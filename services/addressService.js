const Address = require("../models/addressModel");

const addAddress = async (addressData) => {
  const address = new Address(addressData);
  return await address.save();
};

const getAddressBook = async () => {
  return await Address.find({});
};

const getAddressById = async (id) => {
  return await Address.findById(id);
};

const deleteAddress = async (id) => {
  return await Address.findByIdAndDelete(id);
};

module.exports = {
  addAddress,
  getAddressBook,
  getAddressById,
  deleteAddress,
};
