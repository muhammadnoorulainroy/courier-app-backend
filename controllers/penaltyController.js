const penaltyService = require("../services/penaltyService");
const logger = require("../config/logger");

// Create a manual penalty
const createPenalty = async (req, res) => {
  try {
    // Extract penalty data from the request body
    const penaltyData = req.body;

    // Create the penalty
    const penalty = await penaltyService.createPenalty(penaltyData);

    // Log the successful creation
    logger.info("Penalty created successfully.");
    res.status(201).json(penalty);
  } catch (error) {
    // Log the error and respond with status 500
    logger.error(`Error creating penalty: ${error.message}`);
    res.status(500).json({ message: "Error creating penalty" });
  }
};

// Update a penalty
const updatePenalty = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Update the penalty based on the provided ID and data
    const penalty = await penaltyService.updatePenalty(id, updatedData);

    // Log the successful update
    logger.info("Penalty updated successfully.");
    res.status(200).json(penalty);
  } catch (error) {
    // Log the error and respond with status 500
    logger.error(`Error updating penalty: ${error.message}`);
    res.status(500).json({ message: "Error updating penalty" });
  }
};

// Get all penalties
const getPenalties = async (req, res) => {
  try {
    // Fetch all penalties
    const penalties = await penaltyService.getPenalties();

    // Log the successful retrieval
    logger.info("Retrieved all penalties successfully.");
    res.status(200).json(penalties);
  } catch (error) {
    // Log the error and respond with status 500
    logger.error(`Error retrieving penalties: ${error.message}`);
    res.status(500).json({ message: "Error retrieving penalties" });
  }
};

// Get penalty configuration
const getPenaltyConfig = async (req, res) => {
  try {
    // Fetch penalty configuration
    const config = await penaltyService.getPenaltyConfig();

    // Log the successful retrieval
    logger.info("Retrieved penalty configuration successfully.");
    res.status(200).json(config);
  } catch (error) {
    // Log the error and respond with status 500
    logger.error(`Error retrieving penalty configuration: ${error.message}`);
    res.status(500).json({ message: "Error retrieving penalty configuration" });
  }
};

// Update penalty configuration
const updatePenaltyConfig = async (req, res) => {
  try {
    // Extract configuration data from the request body
    const configData = req.body;

    // Update the penalty configuration
    const config = await penaltyService.updatePenaltyConfig(configData);

    // Log the successful update
    logger.info("Penalty configuration updated successfully.");
    res.status(200).json(config);
  } catch (error) {
    // Log the error and respond with status 500
    logger.error(`Error updating penalty configuration: ${error.message}`);
    res.status(500).json({ message: "Error updating penalty configuration" });
  }
};

module.exports = {
  createPenalty,
  updatePenalty,
  getPenalties,
  getPenaltyConfig,
  updatePenaltyConfig,
};
