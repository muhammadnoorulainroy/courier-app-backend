const penaltyService = require("../services/penaltyService");
const logger = require("../config/logger");

// Create a manual penalty
const createPenalty = async (req, res) => {
  try {
    const penalty = await penaltyService.createPenalty(req.body);
    logger.info("Penalty created successfully.");
    res.status(201).json(penalty);
  } catch (error) {
    logger.error(`Error creating penalty: ${error.message}`);
    res.status(500).json({ message: "Error creating penalty" });
  }
};

// Update a penalty
const updatePenalty = async (req, res) => {
  try {
    const penalty = await penaltyService.updatePenalty(req.params.id, req.body);
    logger.info("Penalty updated successfully.");
    res.status(200).json(penalty);
  } catch (error) {
    logger.error(`Error updating penalty: ${error.message}`);
    res.status(500).json({ message: "Error updating penalty" });
  }
};

// Get all penalties
const getPenalties = async (req, res) => {
  try {
    const penalties = await penaltyService.getPenalties();
    logger.info("Retrieved all penalties successfully.");
    res.status(200).json(penalties);
  } catch (error) {
    logger.error(`Error retrieving penalties: ${error.message}`);
    res.status(500).json({ message: "Error retrieving penalties" });
  }
};

// Get penalty configuration
const getPenaltyConfig = async (req, res) => {
  try {
    const config = await penaltyService.getPenaltyConfig();
    logger.info("Retrieved penalty configuration successfully.");
    res.status(200).json(config);
  } catch (error) {
    logger.error(`Error retrieving penalty configuration: ${error.message}`);
    res.status(500).json({ message: "Error retrieving penalty configuration" });
  }
};

// Update penalty configuration
const updatePenaltyConfig = async (req, res) => {
  try {
    const config = await penaltyService.updatePenaltyConfig(req.body);
    logger.info("Penalty configuration updated successfully.");
    res.status(200).json(config);
  } catch (error) {
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
