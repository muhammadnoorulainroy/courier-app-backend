const express = require("express");
const router = express.Router();
const sellerRoutes = require("./sellerRoutes");
const courierRoutes = require("./courierRoutes");
const shipmentRoutes = require("./shipmentRoutes");
const addressRoutes = require("./addressRoutes");
const wallerRoutes = require("./walletRoutes");


router.use("/seller", sellerRoutes);
router.use("/courier", courierRoutes);
router.use("/shipment", shipmentRoutes)
router.use("/address", addressRoutes)
router.use("/wallet", wallerRoutes)


module.exports = router;
