
const otpService = require('../services/otpService');
const userService = require('../services/userService');  // Assume it contains logic to save/find user

// Request OTP
exports.requestOtp = async (req, res) => {
    try {
        const { phone } = req.body;
        // const response = await otpService.sendOtp(phone);
        res.json(phone);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Verify OTP and Sign In / Sign Up
exports.verifyOtp = async (req, res) => {
    try {
        const { phone, otp } = req.body;
        const isValid = otpService.verifyOtp(phone, otp);

        if (!isValid) return res.status(400).json({ message: 'Invalid or expired OTP' });

        // Check if user exists, if not create one
        let user = await userService.findUserByPhone(phone);
        if (!user) user = await userService.createUser({ phone });

        // Generate token
        const token = userService.generateToken(user._id);
        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
    