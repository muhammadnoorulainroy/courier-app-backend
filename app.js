
require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./routes'); // import routes

// Middleware
app.use(express.json());

// Routes
app.use('/api', routes);

module.exports = app;
    