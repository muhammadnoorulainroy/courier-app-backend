require('dotenv').config();
const express = require('express');
const logger = require('./config/logger');
const routes = require('./routes');

const app = express();

// Middleware
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api', routes);

module.exports = app;
