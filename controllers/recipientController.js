const recipientService = require('../services/recipientService');
const logger = require('../config/logger');

// Get all recipients along with their addresses
const getAllRecipients = async (req, res) => {
    try {
        const recipients = await recipientService.getAllRecipients();
        logger.info('Fetched all recipients successfully');
        res.status(200).json({ recipients });
    } catch (error) {
        logger.error(`Error fetching recipients: ${error.message}`);
        res.status(500).json({ message: 'Error fetching recipients' });
    }
};

// Delete a recipient and their associated addresses
const deleteRecipient = async (req, res) => {
    try {
        const { id } = req.params;
        await recipientService.deleteRecipient(id);
        logger.info(`Recipient with ID ${id} deleted successfully`);
        res.status(200).json({ message: 'Recipient deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting recipient: ${error.message}`);
        res.status(500).json({ message: 'Error deleting recipient' });
    }
};

module.exports = { getAllRecipients, deleteRecipient };
