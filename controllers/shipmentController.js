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

module.exports = { createShipment, updatePaymentStatus, getShipmentSummary, getShipment };
