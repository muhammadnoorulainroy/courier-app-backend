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
}

module.exports = { createShipment, updatePaymentStatus, getShipmentSummary, getShipmentById };
