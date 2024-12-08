const twilio = require('twilio');
const logger = require('../config/logger');

// Initialize Twilio client
const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Function to send WhatsApp message
const sendWhatsAppMessage = async (to, body) => {
  try {
    // Ensure 'from' and 'to' both have whatsapp: prefix
    const from = process.env.TWILIO_WHATSAPP_NUMBER;  // WhatsApp-enabled Twilio number

    if (!to || !body) {
      throw new Error('Phone number and message body are required');
    }

    // Send WhatsApp message using Twilio's API
    const message = await client.messages.create({
      body: body,
      from: from, // Twilio WhatsApp-enabled number
      to: `whatsapp:${to}`, // Recipient's phone number in WhatsApp format
    });

    logger.info(`WhatsApp message sent to ${to}: ${message.sid}`);
    return message;
  } catch (error) {
    logger.error(`Failed to send WhatsApp message: ${error.message}`);
    throw new Error('Failed to send WhatsApp message');
  }
};

module.exports = { sendWhatsAppMessage };
