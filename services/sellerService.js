const Seller = require("../models/sellerModel");
const Shipment = require("../models/shipmentModel");


const savePersonalInfo = async (personalInfo) => {
  return await Seller.updateOne({ phone: personalInfo.phone }, personalInfo, {
    upsert: true,
  });
};

const findUserByPhone = async (phone) => {
  return await Seller.findOne({ phone });
};

const getAllSellers = async () => {
  const sellers = await Seller.find().lean(); // Use lean() for plain JavaScript objects

  // Calculate the number of active sellers
  const activeSellerCount = await Seller.countDocuments({ isActive: true });

  // Retrieve shipment stats and total amount paid for each seller
  const sellersWithStats = await Promise.all(
    sellers.map(async (seller) => {
      const stats = await Shipment.aggregate([
        { $match: { senderPhone: seller.phone } },
        {
          $group: {
            _id: "$status",
            totalValue: { $sum: "$summary.totalCost" },
            count: { $sum: 1 },
          },
        },
      ]);

      let totalPaid = 0;
      let shipments = 0;
      let returned = 0;
      let cancelled = 0;
      let delivered = 0;

      stats.forEach((stat) => {
        totalPaid += stat.totalValue;
        if (stat._id === "Delivered") delivered = stat.count;
        else if (stat._id === "Returned") returned = stat.count;
        else if (stat._id === "Cancelled") cancelled = stat.count;
        shipments += stat.count;
      });

      // Remove sensitive fields from each seller
      delete seller.otp;
      delete seller.otpExpiry;
      delete seller.otpPurpose;

      return {
        ...seller,
        shipments,
        returned,
        cancelled,
        delivered,
        totalPaid,
      };
    })
  );

  return { sellers: sellersWithStats, activeSellerCount };
};

const updateSeller = async (sellerId, updateData) => {
  return await Seller.findByIdAndUpdate(sellerId, updateData, { new: true });
};

const removeSeller = async (id) => {
  return await Seller.findByIdAndDelete(id);
};

module.exports = {
  savePersonalInfo,
  findUserByPhone,
  getAllSellers,
  updateSeller,
  removeSeller,
};
