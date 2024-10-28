const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        logger.warn('Access denied. No token provided.');
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Attach decoded user ID or details to request for later use
        logger.info(`User authenticated: ${decoded.id}`);
        next();
    } catch (error) {
        logger.error(`Invalid token. Error: ${error.message}`);
        res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = auth;
