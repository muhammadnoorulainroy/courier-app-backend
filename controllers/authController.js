const jwt = require('jsonwebtoken');
const otpService = require('../services/otpService');
const sellerService = require('../services/sellerService');
const logger = require('../config/logger');

// Request OTP
const requestOtp = async (req, res) => {
    const { phone } = req.body;
    try {
        const ress = await otpService.sendOtp(phone);
        res.status(200).json({ message: 'OTP sent successfully' });
        logger.info({ message: 'OTP sent successfully' })
    } catch (error) {
        logger.error({ error: 'Error sending OTP', error })
        res.status(500).json({ message: 'Error sending OTP', error });
    }
};

// Verify OTP and create a new seller record if the seller does not already exist
const verifyOtp = async (req, res) => {
    const { phone, otp } = req.body;
    const isValid = otpService.verifyOtp(phone, otp);

    if (isValid) {
        let seller = await sellerService.findSellerByPhone(phone);

        logger.info({ message: 'OTP verified successfully' })

        // If seller doesn't exist, prompt for additional information in the client app
        if (!seller) {
            return res.status(200).json({ message: 'OTP verified, please complete your registration' });
        }

        // Generate JWT token for existing seller
        const token = jwt.sign({ phone }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Verification successful', token });
    } else {
        logger.error({ error: 'Invalid OTP' })
        res.status(400).json({ message: 'Invalid OTP' });
    }
};

// Save personal information for new seller
const saveSellerInfo = async (req, res) => {
    const { phone, firstName, lastName, businessName } = req.body;

    try {
        const sellerData = { phone, firstName, lastName, businessName };
        
        // Use sellerService to create the seller
        const seller = await sellerService.createSeller(sellerData);

        const token = jwt.sign({ phone }, process.env.JWT_SECRET, { expiresIn: '1h' });
        logger.info({ message: 'Seller registered successfully' })
        res.status(201).json({ message: 'Seller registered successfully', seller, token });
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000 && error.keyPattern && error.keyPattern.phone) {
            // Handle duplicate phone number error
            logger.error({ error: 'Phone number already registered' })
            res.status(400).json({ message: 'Phone number already registered' });
        } else {
            logger.error({ message: 'Error saving seller information', error })
            // Send detailed error message in response
            res.status(500).json({ 
                message: 'Error saving seller information', 
                error: error.message || 'An unknown error occurred'
            });
        }
    }
};


module.exports = {
    requestOtp,
    verifyOtp,
    saveSellerInfo
};
