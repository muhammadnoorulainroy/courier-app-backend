const express = require("express");
const router = express.Router();
const sellerRoutes = require("./sellerRoutes");
const courierRoutes = require("./courierRoutes");
const shipmentRoutes = require("./shipmentRoutes");
const addressRoutes = require("./addressRoutes");
const wallerRoutes = require("./walletRoutes");
const transactionRoutes = require("./transactionRoutes");
const shiftRoutes = require("./shiftRoutes");
const adminRoutes = require("./adminRoutes");
const promocodeRoutes = require("./promocodeRoutes");
const penaltyoutes = require("./penaltyRoutes");
const recipientRoutes = require("./recipientRoutes");
const notificationRoutes = require("./notificationRoutes");
const reportRoutes = require("./reportRoutes");
const twilioRoutes = require("./twilioRoutes")
const stripeRoutes = require("./stripeRoutes")

router.use("/seller", sellerRoutes);
router.use("/courier", courierRoutes);
router.use("/shipment", shipmentRoutes)
router.use("/address", addressRoutes)
router.use("/wallet", wallerRoutes)
router.use("/transaction", transactionRoutes)
router.use("/shift", shiftRoutes);
router.use("/admin", adminRoutes);
router.use("/promocode", promocodeRoutes);
router.use("/penalty", penaltyoutes);
router.use("/recipient", recipientRoutes);
router.use("/notifications", notificationRoutes);
router.use("/report", reportRoutes);
router.use("/twilio", twilioRoutes);
router.use("/stripe", stripeRoutes);

module.exports = router;
