const Address = require("../models/addressModel");
const Recipient = require("../models/recipientModel");

// Add new address to the database
const addAddress = async (addressData) => {
  const address = new Address(addressData);
  return await address.save();
};

// Get all addresses from the database and populate associated recipients
const getAddressBook = async () => {
  // Fetch all addresses
  const addresses = await Address.find({});

  // Populate recipients who have these addresses
  const addressWithRecipients = await Promise.all(
    addresses.map(async (address) => {
      // Populate the recipient details for each address
      const recipient = await Recipient.find({ addresses: address._id })
        .select("");

      return {
        address,
        recipient,
      };
    })
  );

  return addressWithRecipients;
};

// Get a specific address by its ID and populate associated recipients
const getAddressById = async (id) => {
  // Fetch address by ID and populate associated recipients
  const address = await Address.findById(id);
  if (!address) return null;

  const recipient = await Recipient.find({ addresses: address._id }).select(
    ""
  );

  return { address, recipient };
};

// Delete an address by its ID
const deleteAddress = async (id) => {
  return await Address.findByIdAndDelete(id);
};

module.exports = {
  addAddress,
  getAddressBook,
  getAddressById,
  deleteAddress,
};
