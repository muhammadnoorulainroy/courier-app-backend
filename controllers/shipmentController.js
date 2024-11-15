const shipmentService = require("../services/shipmentService");
const logger = require("../config/logger");

const createShipment = async (req, res) => {
  try {
    const shipment = await shipmentService.createShipment(req.body);
    logger.info("Shipment created successfully");
    res
      .status(201)
      .json({ message: "Shipment created successfully", shipment });
  } catch (error) {
    logger.error(`Error creating shipment: ${error.message}`);
    res.status(500).json({ message: "Error creating shipment" });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { shipmentId, status } = req.body;
    await shipmentService.updatePaymentStatus(shipmentId, status);
    logger.info("Payment status updated successfully");
    res.json({ message: "Payment status updated successfully" });
  } catch (error) {
    logger.error(`Error updating payment status: ${error.message}`);
    res.status(500).json({ message: "Error updating payment status" });
  }
};

const getShipmentSummary = async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const summary = await shipmentService.getShipmentSummary(shipmentId);
    res.json({ summary });
  } catch (error) {
    logger.error(`Error fetching shipment summary: ${error.message}`);
    res.status(500).json({ message: "Error fetching shipment summary" });
  }
};

const getShipment = async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const shipment = await shipmentService.getShipmentById(shipmentId);
    if (!shipment) {
      logger.warn(`Shipment with ID ${shipmentId} not found`);
      return res.status(404).json({ message: "Shipment not found" });
    }
    res.status(200).json({ shipment });
  } catch (error) {
    logger.error(`Error fetching shipment: ${error.message}`);
    res.status(500).json({ message: "Error fetching shipment" });
  }
};

const getPendingShipments = async (req, res) => {
  try {
    const shipments = await shipmentService.getPendingShipments();
    logger.info(`Fetched ${shipments.length} pending shipments`);
    res.json({ shipments });
  } catch (error) {
    logger.error(`Error fetching pending shipments: ${error.message}`);
    res.status(500).json({ message: "Error fetching pending shipments" });
  }
};

const getScheduledShipments = async (req, res) => {
  const { courierId } = req.params;
  try {
    const shipments = await shipmentService.getScheduledShipments(courierId);
    logger.info(`Fetched ${shipments.length} scheduled shipments for courier with ID: ${courierId}`);
    res.json({ shipments });
  } catch (error) {
    logger.error(`Error fetching scheduled shipments for ${courierId}: ${error.message}`);
    res.status(500).json({ message: "Error fetching scheduled shipments" });
  }
};

const getDeliveredShipments = async (req, res) => {
  const { courierId } = req.params;
  try {
    const shipments = await shipmentService.getDeliveredShipments(courierId);
    logger.info(`Fetched ${shipments.length} delivered shipments for courier with ID: ${courierId}`);
    res.json({ shipments });
  } catch (error) {
    logger.error(`Error fetching delivered shipments for ${courierId}: ${error.message}`);
    res.status(500).json({ message: "Error fetching delivered shipments" });
  }
};

const updateTrackingStatus = async (req, res) => {
  const { trackingId } = req.params;
  const { status, location } = req.body;

  try {
    const shipment = await shipmentService.updateTrackingStatus(trackingId, { status, location });

    if (!shipment) {
      logger.warn(`Shipment not found for tracking ID: ${trackingId}`);
      return res.status(404).json({ message: "Shipment not found" });
    }

    logger.info(`Tracking status updated to '${status}' for shipment with tracking ID: ${trackingId}`);
    res.json({ message: "Tracking status updated successfully", shipment });
  } catch (error) {
    logger.error(`Error updating tracking status for ${trackingId}: ${error.message}`);
    res.status(500).json({ message: "Error updating tracking status" });
  }
};

const assignShipmentToCourier = async (req, res) => {
  const { trackingId } = req.params;
  const { courierId } = req.body;

  try {
    const shipment = await shipmentService.assignShipmentToCourier(trackingId, courierId);

    if (!shipment) {
      logger.warn(`Shipment not found for tracking ID: ${trackingId}`);
      return res.status(404).json({ message: "Shipment not found" });
    }

    logger.info(`Shipment with tracking ID: ${trackingId} assigned to courier with ID: ${courierId}`);
    res.json({ message: "Shipment assigned to courier successfully", shipment });
  } catch (error) {
    logger.error(`Error assigning shipment to courier for tracking ID ${trackingId}: ${error.message}`);
    res.status(500).json({ message: "Error assigning shipment to courier" });
  }
};

module.exports = {
  createShipment,
  updatePaymentStatus,
  getShipmentSummary,
  getShipment,
  getPendingShipments,
  getScheduledShipments,
  getDeliveredShipments,
  updateTrackingStatus,
  assignShipmentToCourier,
};
