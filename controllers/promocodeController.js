const promoCodeService = require("../services/promoCodeService");
const logger = require("../config/logger");
const { promoCodeSchema } = require("../validators/promoCodeValidator");

// Create a new promo code
const createPromoCode = async (req, res) => {
  try {
    const { error } = promoCodeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const promoCodeData = req.body;
    const newPromoCode = await promoCodeService.createPromoCode(promoCodeData);
    logger.info("Promo code created successfully");
    res.status(201).json(newPromoCode);
  } catch (error) {
    logger.error(`Error creating promo code: ${error.message}`);
    res.status(500).json({ message: "Error creating promo code" });
  }
};

// Get all promo codes
const getAllPromoCodes = async (req, res) => {
  try {
    const promoCodes = await promoCodeService.getAllPromoCodes();
    logger.info("Retrieved all promo codes successfully");
    res.json(promoCodes);
  } catch (error) {
    logger.error(`Error retrieving promo codes: ${error.message}`);
    res.status(500).json({ message: "Error retrieving promo codes" });
  }
};

// Get a single promo code by ID
const getPromoCodeById = async (req, res) => {
  try {
    const promoCodeId = req.params.id;
    const promoCode = await promoCodeService.getPromoCodeById(promoCodeId);
    if (!promoCode) {
      logger.warn(`Promo code with ID ${promoCodeId} not found`);
      return res.status(404).json({ message: "Promo code not found" });
    }
    logger.info("Promo code retrieved successfully");
    res.json(promoCode);
  } catch (error) {
    logger.error(`Error retrieving promo code: ${error.message}`);
    res.status(500).json({ message: "Error retrieving promo code" });
  }
};

// Update a promo code by ID
const updatePromoCode = async (req, res) => {
  try {
    const promoCodeId = req.params.id;
    const updateData = req.body;
    const updatedPromoCode = await promoCodeService.updatePromoCode(
      promoCodeId,
      updateData
    );
    if (!updatedPromoCode) {
      logger.warn(`Promo code with ID ${promoCodeId} not found`);
      return res.status(404).json({ message: "Promo code not found" });
    }
    logger.info("Promo code updated successfully");
    res.json(updatedPromoCode);
  } catch (error) {
    logger.error(`Error updating promo code: ${error.message}`);
    res.status(500).json({ message: "Error updating promo code" });
  }
};

// Delete a promo code by ID
const deletePromoCode = async (req, res) => {
  try {
    const promoCodeId = req.params.id;
    const deletedPromoCode = await promoCodeService.deletePromoCode(
      promoCodeId
    );
    if (!deletedPromoCode) {
      logger.warn(`Promo code with ID ${promoCodeId} not found`);
      return res.status(404).json({ message: "Promo code not found" });
    }
    logger.info("Promo code deleted successfully");
    res.json({ message: "Promo code deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting promo code: ${error.message}`);
    res.status(500).json({ message: "Error deleting promo code" });
  }
};

module.exports = {
  createPromoCode,
  getAllPromoCodes,
  getPromoCodeById,
  updatePromoCode,
  deletePromoCode,
};
