const Penalty = require("../models/penaltyModel");
const PenaltyConfig = require("../models/penaltyConfigModel");

// Create a new penalty in the database
const createPenalty = async (penaltyData) => {
  // Create and save the penalty object
  const penalty = new Penalty(penaltyData);
  await penalty.save();
  return penalty;
};

// Update an existing penalty based on penalty ID
const updatePenalty = async (penaltyId, updatedData) => {
  // Find the penalty by ID and update it with new data
  const penalty = await Penalty.findByIdAndUpdate(penaltyId, updatedData, { new: true });
  return penalty;
};

// Get all penalties from the database
const getPenalties = async () => {
  // Fetch and return all penalties
  return await Penalty.find();
};

// Get penalty configuration (if any)
const getPenaltyConfig = async () => {
  // Fetch penalty configuration from the database
  return await PenaltyConfig.findOne();
};

// Update penalty configuration (or create if not exists)
const updatePenaltyConfig = async (configData) => {
  // Find and update the existing configuration, or create a new one if it doesn't exist
  const config = await PenaltyConfig.findOneAndUpdate({}, configData, {
    new: true,
    upsert: true,
  });
  return config;
};

module.exports = {
  createPenalty,
  updatePenalty,
  getPenalties,
  getPenaltyConfig,
  updatePenaltyConfig,
};
