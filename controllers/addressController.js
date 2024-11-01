const addressService = require('../services/addressService');
const logger = require('../config/logger');

const addAddress = async (req, res) => {
    try {
        const address = await addressService.addAddress(req.body);
        logger.info('Customer address added successfully');
        res.status(201).json({ message: 'Address added successfully', address });
    } catch (error) {
        logger.error(`Error adding customer address: ${error.message}`);
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
        res.json({ address });
    } catch (error) {
        logger.error(`Error retrieving address: ${error.message}`);
        res.status(500).json({ message: 'Error retrieving address' });
    }
};

const deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;
        await addressService.deleteAddress(id);
        logger.info('Customer address deleted successfully');
        res.json({ message: 'Address deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting address: ${error.message}`);
        res.status(500).json({ message: 'Error deleting address' });
    }
};

module.exports = { addAddress, getAddressBook, getAddressById, deleteAddress };
