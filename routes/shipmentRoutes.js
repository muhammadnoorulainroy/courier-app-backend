const express = require("express");
const router = express.Router();
const shipmentController = require("../controllers/shipmentController");
const validateRequest = require("../middlewares/validateRequest");
const {
  createShipmentSchema,
  paymentSchema,
} = require("../validators/shipmentValidator");

router.post(
  "/create",
  validateRequest(createShipmentSchema),
  shipmentController.createShipment
);
router.post(
  "/update-payment",
  validateRequest(paymentSchema),
  shipmentController.updatePaymentStatus
);
router.get("/:shipmentId/summary", shipmentController.getShipmentSummary);

router.get("/:shipmentId/details", shipmentController.getShipment);
router.get("/pending", shipmentController.getPendingShipments);
router.get("/scheduled/:phone", shipmentController.getScheduledShipments);
router.get("/history/:phone", shipmentController.getDeliveredShipments);
router.patch("/update-tracking-status/:trackingId", shipmentController.updateTrackingStatus);
router.patch("/assign/:trackingId", shipmentController.assignShipmentToCourier);

module.exports = router;
