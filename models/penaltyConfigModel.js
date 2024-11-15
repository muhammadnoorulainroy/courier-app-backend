const mongoose = require("mongoose");

const penaltyConfigSchema = new mongoose.Schema({
    senderCancellation: {
      hoursBeforeShift: Number,
      penaltyAmount: Number,
    },
    courierCancellation: {
      hoursAfterAcceptance: Number,
      penaltyAmount: Number,
    },
  });
  
  module.exports = mongoose.model("PenaltyConfig", penaltyConfigSchema);
  