const { v4: uuidv4 } = require("uuid");

const addressService = require('../services/addressService');
const recipientService = require('../services/recipientService');
const logger = require('../config/logger');
const { createAddressSchema } = require('../validators/addressValidator');

const addAddress = async (req, res) => {
    try {
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

        // Check if recipient exists
        let recipient = await recipientService.getRecipientByPhone(phone);

        // Create new address
        const addressData = {
            district,
            streetName,
            buildingNumber,
            floorNumber,
            apartmentNumber,
            closestLandmark,
            locationLink,
            latitude,
            longitude
        };
        const address = await addressService.addAddress(addressData);

        if (recipient) {
            // Update recipient's addresses
            recipient.addresses.push(address._id);
            await recipient.save();
            logger.info(`Address added to existing recipient with phone: ${phone}`);
        } else {
            // Create a new recipient
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

        res.status(201).json({ message: 'Address added successfully', address, recipient });
    } catch (error) {
        logger.error(`Error adding address: ${error.message}`);
        res.status(500).json({ message: 'Error adding address' });
    }
};

const getAddressBook = async (req, res) => {
    try {
        const addresses = await addressService.getAddressBook();
        res.json({ addresses });
    } catch (error) {
        logger.error(`Error retrieving address book: ${error.message}`);
        res.status(500).json({ message: 'Error retrieving address book' });
    }
};

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

        await addressService.deleteAddress(id);
        logger.info('Customer address deleted successfully');
        res.json({ message: 'Address deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting address: ${error.message}`);
        res.status(500).json({ message: 'Error deleting address' });
    }
};

module.exports = { addAddress, getAddressBook, getAddressById, deleteAddress };
