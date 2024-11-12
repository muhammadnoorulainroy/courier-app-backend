const Shipment = require("../models/shipmentModel");

const createShipment = async (shipmentData) => {
  const shipment = new Shipment(shipmentData);
  return await shipment.save();
};

const updatePaymentStatus = async (shipmentId, status) => {
  return await Shipment.findByIdAndUpdate(shipmentId, {
    "paymentDetails.paymentStatus": status,
  });
};

const getShipmentSummary = async (shipmentId) => {
  return await Shipment.findOne({ shipmentId }).select(
    "summary paymentDetails status"
  );
};

const getShipmentById = async (shipmentId) => {
  return await Shipment.findOne({ shipmentId });
};

// Get all shipments that are not yet assigned to any courier
const getPendingShipments = async () => {
  return await Shipment.find({ courierPhone: null, status: "Created" });
};

// Get all shipments assigned to a courier that are not yet delivered
const getScheduledShipments = async (courierPhone) => {
  return await Shipment.find({ courierPhone, status: { $ne: "Delivered" } });
};

// Get all delivered shipments for a specific courier
const getDeliveredShipments = async (courierPhone) => {
  return await Shipment.find({ courierPhone, status: "Delivered" });
};

const updateTrackingStatus = async (trackingId, statusUpdate) => {
  return await Shipment.findOneAndUpdate(
    { trackingId },
    { $push: { trackingStatus: { ...statusUpdate, timestamp: new Date() } } },
    { new: true } // Return the updated document
  );
};

const assignShipmentToCourier = async (trackingId, courierPhone) => {
  return await Shipment.findOneAndUpdate(
    { trackingId, courierPhone: null },
    {
      $set: { courierPhone },
      $push: { trackingStatus: { status: "Shipment Scheduled", timestamp: new Date() } }
    },
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
  assignShipmentToCourier
};
