
const app = require('./app');
const connectDB = require('./config/database');
const logger = require('./config/logger');
const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    logger.info(`Server is running on port ${PORT}`);
});