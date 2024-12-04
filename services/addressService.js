const Address = require("../models/addressModel");
const Recipient = require("../models/recipientModel");
const Seller = require("../models/sellerModel");

// Add a new address to the database and associate it with a seller
const addAddress = async (addressData) => {
  const address = new Address(addressData);
  // Save the address first
  const savedAddress = await address.save();
  return savedAddress;
};

// Get all addresses and populate associated recipients
const getAddressBook = async () => {
  // Fetch all addresses
  const addresses = await Address.find({});

  // Populate recipients who have these addresses
  const addressWithRecipients = await Promise.all(
    addresses.map(async (address) => {
      const recipients = await Recipient.find({ addresses: address._id });

      return {
        address,
        recipients,  // Now returning the recipients for each address
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

  const recipients = await Recipient.find({ addresses: address._id });

  return { address, recipients };
};

// Delete an address by its ID
const deleteAddress = async (id) => {
  const address = await Address.findById(id);
  if (!address) return null;

  // Also remove the address reference from associated recipients
  await Recipient.updateMany(
    { addresses: address._id },
    { $pull: { addresses: address._id } }
  );

  // Delete the address from the database
  return await Address.findByIdAndDelete(id);
};

// Get all addresses for a specific seller, populated with associated recipients
const getAddressesBySeller = async (sellerId) => {
  const seller = await Seller.findOne({ userId: sellerId });
  if (!seller) return null;

  const addresses = await Address.find({ "_id": { $in: seller.addresses } });

  const addressWithRecipients = await Promise.all(
    addresses.map(async (address) => {
      const recipients = await Recipient.find({ addresses: address._id });

      return {
        address
      };
    })
  );

  return addressWithRecipients;
};

const updateAddress = async (addressId, addressData) => {
  try {
    // Find the address by ID and update it with the provided data
    const updatedAddress = await Address.findByIdAndUpdate(addressId, addressData, { new: true, runValidators: true });
    
    // Return the updated address if found, otherwise return null
    return updatedAddress ? updatedAddress : null;
  } catch (error) {
    throw new Error(`Error updating address: ${error.message}`);
  }
};

module.exports = {
  addAddress,
  getAddressBook,
  getAddressById,
  deleteAddress,
  getAddressesBySeller,
  updateAddress
};
