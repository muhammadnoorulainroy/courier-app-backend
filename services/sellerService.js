const Seller = require('../models/sellerModel');

const findSellerByPhone = async (phone) => {
    return await Seller.findOne({ phone });
};

const createSeller = async (sellerData) => {
    const seller = new Seller(sellerData);
    return await seller.save();
};

module.exports = {
    findSellerByPhone,
    createSeller
};
