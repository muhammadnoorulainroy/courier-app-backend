const express = require('express');
const router = express.Router();
const twilioController = require('../controllers/twilioController');

// Route to send SMS
router.post('/send-message', twilioController.sendWhatsAppMessage);

module.exports = router;
