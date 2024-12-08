const Shipment = require("../models/shipmentModel");
const Courier = require("../models/courierModel");
const Seller = require("../models/sellerModel");
const Admin = require("../models/adminModel");

const getDateFilter = (range) => {
  const now = new Date();
  let startDate;

  switch (range) {
    case "today":
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case "this_week":
      startDate = new Date(now.setDate(now.getDate() - now.getDay()));
      break;
    case "this_month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    default:
      return new Date(now.getFullYear(), now.getMonth(), 1);
  }

  return { $gte: startDate };
};

const getDashboardStats = async (dateRange) => {
  const dateFilter = getDateFilter(dateRange);

  // Shipment Stats
  const inProgressShipments = await Shipment.countDocuments({
    status: "In Progress",
  });
  const placedShipments = await Shipment.countDocuments({ status: "Created" });
  const deliveredShipments = await Shipment.countDocuments({
    status: "Delivered",
  });
  const cancelledShipments = await Shipment.countDocuments({
    status: "Cancelled",
  });

  // Courier Stats
  const activeCouriers = await Courier.countDocuments({ isActive: true });
  const suspendedCouriers = await Courier.countDocuments({ isActive: false });
  const totalCouriers = await Courier.countDocuments();
  const newCouriers = await Courier.countDocuments({ createdAt: dateFilter });

  // Seller Stats
  const activeSellers = await Seller.countDocuments({ isActive: true });
  const totalSellers = await Seller.countDocuments();
  const newSellers = await Seller.countDocuments({ createdAt: dateFilter });

  return {
    shipments: {
      inProgress: inProgressShipments,
      placed: placedShipments,
      delivered: deliveredShipments,
      cancelled: cancelledShipments,
    },
    couriers: {
      active: activeCouriers,
      suspended: suspendedCouriers,
      total: totalCouriers,
      new: newCouriers,
    },
    sellers: {
      active: activeSellers,
      total: totalSellers,
      new: newSellers,
    },
  };
};

const addAdmin = async (adminData) => {
  const admin = new Admin(adminData);
  return await admin.save();
};

const getAllAdmins = async () => {
  return await Admin.find();
};

const updateAdmin = async (userId, updateData) => {
  return await Admin.findOneAndUpdate({ userId }, updateData, { new: true });
};

const deleteAdmin = async (userId) => {
  return await Admin.findOneAndDelete({ userId });
};

module.exports = {
  getDashboardStats,
  addAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
};
