const Recipient = require("../models/recipientModel");
const Address = require("../models/addressModel");

const getRecipientByPhone = async (phone) => {
  return await Recipient.findOne({ phone });
};

// Get all recipients associated with a specific addressId
const getRecipientsByAddressId = async (addressId) => {
  try {
      const recipients = await Recipient.find({ addresses: addressId });
      return recipients;
  } catch (error) {
      throw new Error('Error retrieving recipients by addressId');
  }
};

const createRecipient = async (recipientData) => {
  const recipient = new Recipient(recipientData);
  return await recipient.save();
};

// Get all recipients with their addresses
const getAllRecipients = async () => {
  return await Recipient.find({}).populate("addresses");
};

// Delete recipient and their associated addresses
const deleteRecipient = async (recipientId) => {
  const recipient = await Recipient.findOne({userId: recipientId });

  if (!recipient) {
    throw new Error("Recipient not found");
  }

  // Remove all associated addresses
  const addressIds = recipient.addresses;
  await Address.deleteMany({ _id: { $in: addressIds } });

  // Remove the recipient
  await Recipient.deleteOne({userId: recipient.userId});

  return { message: "Recipient and associated addresses deleted successfully" };
};

module.exports = {
  getRecipientByPhone,
  createRecipient,
  getAllRecipients,
  deleteRecipient,
  getRecipientsByAddressId
};
