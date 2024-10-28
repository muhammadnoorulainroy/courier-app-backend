const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const findUserByPhone = async (phone) => {
    try {
        return await User.findOne({ phone });
    } catch (error) {
        logger.error(`Error finding user by phone: ${error.message}`);
        throw error;
    }
};

const createUser = async (userData) => {
    try {
        const user = new User(userData);
        return await user.save();
    } catch (error) {
        logger.error(`Error creating user: ${error.message}`);
        throw error;
    }
};

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = {
    findUserByPhone,
    createUser,
    generateToken
};
