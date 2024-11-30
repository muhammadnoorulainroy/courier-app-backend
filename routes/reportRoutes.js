const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

router.get("/sellers/user-info", reportController.getAllSellersReport);
router.get('/sellers/shipment-activity', reportController.getAllSendersShipmentActivity);
router.get('/sellers/finance-info', reportController.getAllSendersFinancialMetrics);
router.get('/sellers/promotion-metrics', reportController.getPromotionsAndEngagementMetrics);
router.get("/sellers/payment-metrics", reportController.getPaymentMetrics);
router.get("/sellers/governorate-shipment-metrics", reportController.getGovernorateShipmentStats);
router.get("/sellers/session-metrics", reportController.getSessionMetrics);

router.get("/couriers/user-info", reportController.getCourierInfoReport);
router.get("/couriers/shipment-activity", reportController.getCourierShipmentReport);
router.get("/couriers/finance-info", reportController.getCourierFinancialMetrics);
router.get("/couriers/performance-metrics", reportController.getCourierPerformanceMetrics);
router.get("/couriers/location-coverage", reportController.getCourierLocationCoverage);
router.get("/couriers/geographic-shipment-distribution", reportController.getCourierGeographicShipmentDistribution);
router.get("/couriers/session-metrics", reportController.getCourierSessionMetrics);
router.get("/couriers/schedules", reportController.getCourierSchedules);
router.get("/recipients/user-info", reportController.getRecipientInfoReport);
router.get("/recipients/shipment-activity", reportController.getRecipientsShipmentActivityPerformance);
router.get("/recipients/finance-and-geographic", reportController.getRecipientReport);
router.get("/shipments", reportController.getAllShipmentReports);
router.get("/promocodes", reportController.getPromocodeReport);
router.get('/penalties', reportController.getPenaltyReport);
router.get('/admin-users', reportController.getAdminUsersReport);
router.get("/transactions", reportController.getTransactionReport);
router.get("/transactions-out", reportController.getDetailedTransactionReport);
router.get("/notifications", reportController.getNotificationMetrics);

module.exports = router;
