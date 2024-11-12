const shiftService = require("../services/shiftService");
const logger = require("../config/logger");

// Start Shift
const startShift = async (req, res) => {
  const { phone } = req.body;

  try {
    const shift = await shiftService.startShift(phone);
    logger.info(`Shift started for courier: ${phone}`);
    res.json({ message: "Shift started successfully", shift });
  } catch (error) {
    logger.error(`Error starting shift for ${phone}: ${error.message}`);
    res.status(500).json({ message: "Error starting shift" });
  }
};

// End Shift
const endShift = async (req, res) => {
  const { phone } = req.body;

  try {
    const shift = await shiftService.endShift(phone);
    logger.info(`Shift ended for courier: ${phone}`);
    res.json({ message: "Shift ended successfully", shift });
  } catch (error) {
    logger.error(`Error ending shift for ${phone}: ${error.message}`);
    res.status(500).json({ message: "Error ending shift" });
  }
};

module.exports = { startShift, endShift };
