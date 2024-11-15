const Shipment = require("../models/shipmentModel");

const createShipment = async (shipmentData) => {
  const shipment = new Shipment(shipmentData);
  return await shipment.save();
};

const updatePaymentStatus = async (shipmentId, status) => {
  return await Shipment.findByIdAndUpdate(
    shipmentId,
    { "paymentDetails.paymentStatus": status },
    { new: true }
  );
};

const getShipmentSummary = async (shipmentId) => {
  return await Shipment.findById(shipmentId, "summary");
};

const getShipmentById = async (shipmentId) => {
  return await Shipment.findById(shipmentId);
};

const getPendingShipments = async () => {
  return await Shipment.find({ courierId: null, status: "Created" });
};

const getScheduledShipments = async (courierId) => {
  return await Shipment.find({ courierId, status: { $in: ["Scheduled", "In Transit"] } });
};

const getDeliveredShipments = async (courierId) => {
  return await Shipment.find({ courierId, status: "Delivered" });
};

const updateTrackingStatus = async (trackingId, trackingData) => {
  return await Shipment.findOneAndUpdate(
    { trackingId },
    { $push: { trackingStatus: trackingData } },
    { new: true }
  );
};

const assignShipmentToCourier = async (trackingId, courierId) => {
  return await Shipment.findOneAndUpdate(
    { trackingId },
    { courierId, status: "Scheduled" },
    { new: true }
  );
};

module.exports = {
  createShipment,
  updatePaymentStatus,
  getShipmentSummary,
  getShipmentById,
  getPendingShipments,
  getScheduledShipments,
  getDeliveredShipments,
  updateTrackingStatus,
  assignShipmentToCourier,
};
