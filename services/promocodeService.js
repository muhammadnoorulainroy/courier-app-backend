const PromoCode = require("../models/promocodeModel");

// Create a new promo code
const createPromoCode = async (promoCodeData) => {
  const promoCode = new PromoCode(promoCodeData);
  return await promoCode.save();
};

// Get all promo codes
const getAllPromoCodes = async () => {
  return await PromoCode.find();
};

// Get a single promo code by ID
const getPromoCodeById = async (promoCodeId) => {
  return await PromoCode.findById(promoCodeId);
};

// Update a promo code by ID
const updatePromoCode = async (promoCodeId, updateData) => {
  return await PromoCode.findByIdAndUpdate(promoCodeId, updateData, {
    new: true,
    runValidators: true
  });
};

// Delete a promo code by ID
const deletePromoCode = async (promoCodeId) => {
  return await PromoCode.findByIdAndDelete(promoCodeId);
};

module.exports = {
  createPromoCode,
  getAllPromoCodes,
  getPromoCodeById,
  updatePromoCode,
  deletePromoCode
};
