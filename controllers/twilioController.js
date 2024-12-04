const twilioService = require('../services/twilioService');
const logger = require('../config/logger');

// Controller function to send message
const sendWhatsAppMessage = async (req, res) => {
  const { to, body } = req.body;

  try {
    if (!to || !body) {
      return res.status(400).json({ message: 'Phone number and message body are required' });
    }

    // Send the WhatsApp message using Twilio Service
    const message = await twilioService.sendWhatsAppMessage(to, body);

    res.status(200).json({ message: 'WhatsApp message sent successfully', sid: message.sid });
  } catch (error) {
    logger.error(`Error sending WhatsApp message: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendWhatsAppMessage };
