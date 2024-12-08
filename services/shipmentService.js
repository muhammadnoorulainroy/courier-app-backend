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
  return await Shipment.find({ status: "Created", courierId: null })
    .sort({ createdAt: -1 }); // Sorting by createdAt in descending order
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

const deleteShipmentByTrackingId = async (trackingId) => {
  // Find the shipment by trackingId and delete it
  const shipment = await Shipment.findOneAndDelete({ trackingId });

  return shipment; // If shipment is not found, `null` will be returned
};

const getShipmentsBySeller = async (sellerId, status = null) => {
  // Build the query object
  const query = { senderId: sellerId }; // Fetch shipments by seller's senderId
  
  if (status) {
    query.status = status; // Filter by shipment status if provided
  }

  try {
    // Fetch shipments from the database with sorting by createdAt (most recent first)
    const shipments = await Shipment.find(query)
      .sort({ createdAt: -1 }); // Sort by creation date (descending order)

    return shipments;
  } catch (error) {
    throw new Error('Error fetching shipments from the database');
  }
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
