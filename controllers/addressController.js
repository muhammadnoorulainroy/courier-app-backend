const { v4: uuidv4 } = require("uuid");
const addressService = require('../services/addressService');
const recipientService = require('../services/recipientService');
const logger = require('../config/logger');
const { createAddressSchema } = require('../validators/addressValidator');
const sellerService = require('../services/sellerService');

// Add new address or link to existing recipient with seller association
const addAddress = async (req, res) => {
  try {
    const { 
      sellerId,  // Seller ID to associate with the address
      district,
      streetName,
      buildingNumber,
      floorNumber,
      apartmentNumber,
      closestLandmark,
      locationLink,
      latitude,
      longitude,
      governorate,
      firstName,
      lastName,
      phone,
      whatsapp
    } = req.body;

    // Validate input
    const validation = createAddressSchema.validate(req.body);
    if (validation.error) {
      logger.warn(`Validation error: ${validation.error.message}`);
      return res.status(400).json({ message: validation.error.message });
    }

    // Check if seller exists
    const seller = await sellerService.getSellerById(sellerId);
    if (!seller) {
      logger.warn(`Seller with ID ${sellerId} not found`);
      return res.status(404).json({ message: "Seller not found" });
    }

    // Check if recipient exists by phone
    let recipient = await recipientService.getRecipientByPhone(phone);

    // Create new address data object
    const addressData = {
      district,
      streetName,
      buildingNumber,
      floorNumber,
      apartmentNumber,
      closestLandmark,
      locationLink,
      latitude,
      longitude,
      governorate,
      sellerId  // Associate address with seller
    };

    // Add address to the database
    const address = await addressService.addAddress(addressData);
    console.log(address, "address")

    if (recipient) {
      // If recipient exists, add the address to their address list
      recipient.addresses.push(address._id);
      await recipient.save();
      logger.info(`Address added to existing recipient with phone: ${phone}`);
    } else {
      // Create a new recipient if not found
      const recipientData = {
        userId: uuidv4(),
        firstName,
        lastName,
        phone,
        whatsapp,
        addresses: [address._id]
      };
      recipient = await recipientService.createRecipient(recipientData);
      logger.info(`New recipient created with phone: ${phone}`);
    }

    // Return success response with the address and recipient details
    res.status(201).json({ message: 'Address added successfully', address, recipient });
  } catch (error) {
    logger.error(`Error adding address: ${error.message}`);
    res.status(500).json({ message: 'Error adding address' });
  }
};

// Get address book for a specific seller
const getAddressBook = async (req, res) => {
  const { sellerId } = req.params;

  try {
    const addresses = await addressService.getAddressBookBySeller(sellerId);
    if (!addresses || addresses.length === 0) {
      logger.warn(`No addresses found for seller with ID: ${sellerId}`);
      return res.status(404).json({ message: 'No addresses found for this seller.' });
    }
    res.status(200).json({ addresses });
  } catch (error) {
    logger.error(`Error retrieving address book for seller ${sellerId}: ${error.message}`);
    res.status(500).json({ message: 'Error retrieving address book' });
  }
};

// Get address by ID
const getAddressById = async (req, res) => {
    try {
        const { id } = req.params;
        const address = await addressService.getAddressById(id);
        if (!address) {
            logger.warn(`Address with ID ${id} not found.`);
            return res.status(404).json({ message: 'Address not found' });
        }
        res.json({ address });
    } catch (error) {
        logger.error(`Error retrieving address: ${error.message}`);
        res.status(500).json({ message: 'Error retrieving address' });
    }
};

// Delete address by ID
const deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const address = await addressService.getAddressById(id);
        if (!address) {
            logger.warn(`Address with ID ${id} not found.`);
            return res.status(404).json({ message: 'Address not found' });
        }

        // Remove address reference from recipients
        const recipients = await recipientService.getRecipientsByAddressId(id);
        for (const recipient of recipients) {
            recipient.addresses = recipient.addresses.filter(
                (addrId) => addrId.toString() !== id
            );
            await recipient.save();
        }

        // Delete the address from the database
        await addressService.deleteAddress(id);
        logger.info('Customer address deleted successfully');
        res.json({ message: 'Address deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting address: ${error.message}`);
        res.status(500).json({ message: 'Error deleting address' });
    }
};

// Add a new address for a seller
const addAddressToSeller = async (req, res) => {
  const { sellerId } = req.params;
  const {
    district,
    streetName,
    buildingNumber,
    floorNumber,
    apartmentNumber,
    closestLandmark,
    locationLink,
    latitude,
    longitude,
    governorate,
   } = req.body;

  try {
    // Check if the seller exists
    const seller = await sellerService.getSellerById(sellerId);
    if (!seller) {
      logger.warn(`Seller with ID ${sellerId} not found`);
      return res.status(404).json({ message: "Seller not found" });
    }

    // Create the new address
    const addressData = {
        district,
        streetName,
        buildingNumber,
        floorNumber,
        apartmentNumber,
        closestLandmark,
        locationLink,
        latitude,
        longitude,
        governorate
    };

    const newAddress = await addressService.addAddress(addressData);

    // Add address to the seller's address list
    seller.addresses.push(newAddress._id);
    await seller.save();

    res.status(201).json({ message: "Address added successfully", address: newAddress });
  } catch (error) {
    logger.error(`Error adding address: ${error.message}`);
    res.status(500).json({ message: "Error adding address" });
  }
};

// Get all addresses for a seller
const getSellerAddresses = async (req, res) => {
  const { sellerId } = req.params;
  console.log(sellerId, 'seller id')

  try {
    // Check if the seller exists
    const seller = await sellerService.getSellerById(sellerId);
    if (!seller) {
      logger.warn(`Seller with ID ${sellerId} not found`);
      return res.status(404).json({ message: "Seller not found" });
    }

    // Get all addresses for the seller
    const addresses = await addressService.getAddressesBySeller(sellerId);

    res.status(200).json({ addresses });
  } catch (error) {
    logger.error(`Error retrieving seller's addresses: ${error.message}`);
    res.status(500).json({ message: "Error retrieving addresses" });
  }
};

// Update an address for a seller
const updateSellerAddress = async (req, res) => {
    const { sellerId, addressId } = req.params;
    const { district, streetName, buildingNumber, floorNumber, apartmentNumber, closestLandmark, locationLink, latitude, longitude, governorate } = req.body;
  
    try {
      // Check if the seller exists
      const seller = await sellerService.getSellerById(sellerId);
      if (!seller) {
        logger.warn(`Seller with ID ${sellerId} not found`);
        return res.status(404).json({ message: "Seller not found" });
      }
  
      // Prepare the address data to be updated based on the fields that are in the request body
      const addressData = {};
  
      if (district) addressData.district = district;
      if (streetName) addressData.streetName = streetName;
      if (buildingNumber) addressData.buildingNumber = buildingNumber;
      if (floorNumber) addressData.floorNumber = floorNumber;
      if (apartmentNumber) addressData.apartmentNumber = apartmentNumber;
      if (closestLandmark) addressData.closestLandmark = closestLandmark;
      if (locationLink) addressData.locationLink = locationLink;
      if (latitude) addressData.latitude = latitude;
      if (longitude) addressData.longitude = longitude;
      if (governorate) addressData.governorate = governorate;
  
      // Call the service to update the address
      const updatedAddress = await addressService.updateAddress(addressId, addressData);
      if (!updatedAddress) {
        logger.warn(`Address with ID ${addressId} not found`);
        return res.status(404).json({ message: "Address not found" });
      }
  
      // Return the response with updated address
      res.status(200).json({ message: "Address updated successfully", address: updatedAddress });
    } catch (error) {
      logger.error(`Error updating address: ${error.message}`);
      res.status(500).json({ message: "Error updating address" });
    }
  };
  

// Delete an address for a seller
const deleteSellerAddress = async (req, res) => {
  const { sellerId, addressId } = req.params;

  try {
    const seller = await sellerService.getSellerById(sellerId);
    if (!seller) {
      logger.warn(`Seller with ID ${sellerId} not found`);
      return res.status(404).json({ message: "Seller not found" });
    }

    // Remove address from the seller's address list
    seller.addresses = seller.addresses.filter(id => id.toString() !== addressId);
    await seller.save();

    // Delete the address itself
    await addressService.deleteAddress(addressId);

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting address: ${error.message}`);
    res.status(500).json({ message: "Error deleting address" });
  }
};

module.exports = {
  addAddressToSeller,
  getSellerAddresses,
  updateSellerAddress,
  deleteSellerAddress,
  deleteAddress,
  getAddressById,
  getAddressBook,
  addAddress
};
