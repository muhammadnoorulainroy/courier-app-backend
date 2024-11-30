const Shipment = require("../models/shipmentModel");

// Create a new shipment
const createShipment = async (shipmentData) => {
  const shipment = new Shipment(shipmentData);
  return await shipment.save();
};

// Update payment status of a shipment
const updatePaymentStatus = async (shipmentId, status) => {
  return await Shipment.findByIdAndUpdate(
    shipmentId,
    { "paymentDetails.paymentStatus": status },
    { new: true }
  );
};

// Get shipment summary (financial details like total cost, discount, taxes)
const getShipmentSummary = async (shipmentId) => {
  return await Shipment.findById(shipmentId, "summary");
};

// Get shipment details by shipment ID
const getShipmentById = async (shipmentId) => {
  return await Shipment.findById(shipmentId);
};

// Get all pending shipments (without assigned courier)
const getPendingShipments = async () => {
  return await Shipment.find({ courierId: null, status: "Created" });
};

// Get scheduled shipments for a specific courier
const getScheduledShipments = async (courierId) => {
  return await Shipment.find({ courierId, status: { $in: ["Scheduled", "In Transit"] } });
};

// Get delivered shipments for a specific courier
const getDeliveredShipments = async (courierId) => {
  return await Shipment.find({ courierId, status: "Delivered" });
};

// Update tracking status for a shipment
const updateTrackingStatus = async (trackingId, trackingData) => {
  return await Shipment.findOneAndUpdate(
    { trackingId },
    { $push: { trackingStatus: trackingData } },
    { new: true }
  );
};

// Assign shipment to a courier
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
