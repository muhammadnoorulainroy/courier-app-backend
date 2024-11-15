const Penalty = require("../models/penaltyModel");
const PenaltyConfig = require("../models/penaltyConfigModel");

const createPenalty = async (penaltyData) => {
  const penalty = new Penalty(penaltyData);
  await penalty.save();
  return penalty;
};

const updatePenalty = async (penaltyId, updatedData) => {
  const penalty = await Penalty.findByIdAndUpdate(penaltyId, updatedData, {
    new: true,
  });
  return penalty;
};

const getPenalties = async () => {
  return await Penalty.find();
};

const getPenaltyConfig = async () => {
  return await PenaltyConfig.findOne();
};

const updatePenaltyConfig = async (configData) => {
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
