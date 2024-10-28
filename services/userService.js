
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.findUserByPhone = async (phone) => {
    return await User.findOne({ phone });
};

exports.createUser = async (userData) => {
    const user = new User(userData);
    return await user.save();
};

exports.generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};
    