const express = require("express");
const router = express.Router();
const sellerRoutes = require("./sellerRoutes");
const courierRoutes = require("./courierRoutes");
const shipmentRoutes = require("./shipmentRoutes");
const addressRoutes = require("./addressRoutes");


router.use("/seller", sellerRoutes);
router.use("/courier", courierRoutes);
router.use("/shipment", shipmentRoutes)
router.use("/address", addressRoutes)


module.exports = router;
