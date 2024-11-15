const Seller = require("../models/sellerModel");
const Shipment = require("../models/shipmentModel");

const findSellerById = async (userId) => {
  return await Seller.findOne({ userId })
}

const savePersonalInfo = async (userId, personalInfo) => {
  await Seller.updateOne({ userId }, personalInfo, { upsert: true });

  return await findSellerById(userId)
};


const getAllSellers = async () => {
  const sellers = await Seller.find().lean();
  const activeSellerCount = await Seller.countDocuments({ isActive: true });

  const sellersWithStats = await Promise.all(
    sellers.map(async (seller) => {
      const stats = await Shipment.aggregate([
        { $match: { senderId: seller.userId } },
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

const updateSeller = async (userId, updateData) => {
  return await Seller.findOneAndUpdate({ userId }, updateData, { new: true });
};

const removeSeller = async (userId) => {
  return await Seller.findOneAndDelete({ userId });
};

module.exports = {
  savePersonalInfo,
  getAllSellers,
  updateSeller,
  removeSeller,
};
