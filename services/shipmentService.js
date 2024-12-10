const Shipment = require("../models/shipmentModel");
const Recipient = require("../models/recipientModel");
const Seller = require("../models/sellerModel");
const Courier = require("../models/courierModel");

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

const deleteShipmentByTrackingId = async (trackingId) => {
  // Find the shipment by trackingId and delete it
  const shipment = await Shipment.findOneAndDelete({ trackingId });

  return shipment; // If shipment is not found, `null` will be returned
};

// Helper to fetch associated details by UUID
const populateShipmentDetails = async (shipment) => {
  const recipient = await Recipient.findOne({ userId: shipment.recipientId });
  const sender = await Seller.findOne({ userId: shipment.senderId });
  const courier = shipment.courierId
    ? await Courier.findOne({ userId: shipment.courierId })
    : null;

  return {
    ...shipment.toObject(),
    recipient,
    sender,
    courier,
  };
};

// Get shipment details by shipment ID with recipient, seller, and courier details
const getShipmentById = async (shipmentId) => {
  const shipment = await Shipment.findById(shipmentId);
  if (!shipment) return null;

  return await populateShipmentDetails(shipment);
};

// Get all pending shipments with recipient, seller, and courier details
const getPendingShipments = async () => {
  const shipments = await Shipment.find({ status: "Created", courierId: null }).sort({
    createdAt: -1,
  });

  return await Promise.all(shipments.map((shipment) => populateShipmentDetails(shipment)));
};

// Get scheduled shipments for a specific courier with full details
const getScheduledShipments = async (courierId) => {
  const shipments = await Shipment.find({
    courierId,
    status: { $in: ["Scheduled", "In Transit"] },
  });

  return await Promise.all(shipments.map((shipment) => populateShipmentDetails(shipment)));
};

// Get delivered shipments for a specific courier with full details
const getDeliveredShipments = async (courierId) => {
  const shipments = await Shipment.find({ courierId, status: "Delivered" });

  return await Promise.all(shipments.map((shipment) => populateShipmentDetails(shipment)));
};

// Get shipments for a seller with full details
const getShipmentsBySeller = async (sellerId, status = null) => {
  const query = { senderId: sellerId };
  if (status) query.status = status;

  const shipments = await Shipment.find(query).sort({ createdAt: -1 });

  return await Promise.all(shipments.map((shipment) => populateShipmentDetails(shipment)));
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
  deleteShipmentByTrackingId,
  getShipmentsBySeller
};
