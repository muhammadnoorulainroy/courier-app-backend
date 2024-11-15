const shiftService = require("../services/shiftService");
const logger = require("../config/logger");

// Start Shift
const startShift = async (req, res) => {
  const { courierId } = req.body;

  try {
    const shift = await shiftService.startShift(courierId);
    logger.info(`Shift started for courier: ${courierId}`);
    res.json({ message: "Shift started successfully", shift });
  } catch (error) {
    logger.error(`Error starting shift for ${courierId}: ${error.message}`);
    res.status(500).json({ message: "Error starting shift", error: error.message });
  }
};

// End Shift
const endShift = async (req, res) => {
  const { courierId } = req.body;

  try {
    const shift = await shiftService.endShift(courierId);
    logger.info(`Shift ended for courier: ${courierId}`);
    res.json({ message: "Shift ended successfully", shift });
  } catch (error) {
    logger.error(`Error ending shift for ${courierId}: ${error.message}`);
    res.status(500).json({ message: "Error ending shift", error: error.message });
  }
};

module.exports = { startShift, endShift };
