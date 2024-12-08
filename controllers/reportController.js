const reportService = require("../services/reportService");
const logger = require("../config/logger");

const getAllSellersReport = async (req, res) => {
  try {
    const reportData = await reportService.getAllSellersReport();

    logger.info(`Report generated successfully for all sellers.`);
    res.status(200).json({ success: true, data: reportData });
  } catch (error) {
    logger.error(`Error generating report for sellers: ${error.message}`);
    res
      .status(500)
      .json({ success: false, message: "Error generating report" });
  }
};

const getAllSendersShipmentActivity = async (req, res) => {
  try {
    // Fetch data from the service
    const activityData = await reportService.getAllSendersShipmentActivity();

    logger.info(
      "Shipment activity and performance data retrieved for all senders"
    );
    res.status(200).json({
      message: "Shipment activity data retrieved successfully",
      data: activityData,
    });
  } catch (error) {
    logger.error(
      `Error fetching shipment activity data for all senders: ${error.message}`
    );
    res.status(500).json({ message: "Error fetching shipment activity data" });
  }
};

const getAllSendersFinancialMetrics = async (req, res) => {
  try {
    // Fetch data from the service
    const financialMetrics =
      await reportService.getAllSendersFinancialMetrics();

    logger.info("Financial metrics and values retrieved for all senders");
    res.status(200).json({
      message: "Financial metrics retrieved successfully",
      data: financialMetrics,
    });
  } catch (error) {
    logger.error(
      `Error fetching financial metrics for all senders: ${error.message}`
    );
    res.status(500).json({ message: "Error fetching financial metrics" });
  }
};

const getPromotionsAndEngagementMetrics = async (req, res) => {
  try {
    const metrics = await reportService.getPromotionsAndEngagementMetrics();
    logger.info("Promotions and engagement metrics retrieved successfully.");
    res.status(200).json({
      message: "Promotions and engagement metrics retrieved successfully.",
      data: metrics,
    });
  } catch (error) {
    logger.error(
      `Error fetching promotions and engagement metrics: ${error.message}`
    );
    res.status(500).json({
      message: "Error fetching promotions and engagement metrics",
      error: error.message,
    });
  }
};

const getPaymentMetrics = async (req, res) => {
  try {
    const metrics = await reportService.getPaymentMetrics();
    logger.info("Payment metrics generated successfully.");
    res
      .status(200)
      .json({ message: "Metrics fetched successfully", data: metrics });
  } catch (error) {
    logger.error(`Error fetching payment metrics: ${error.message}`);
    res.status(500).json({ message: "Error fetching payment metrics" });
  }
};

const getGovernorateShipmentStats = async (req, res) => {
    try {
      const stats = await reportService.getGovernorateShipmentStats();
      logger.info("Governorate shipment stats fetched successfully.");
      res.status(200).json({ message: "Stats fetched successfully", data: stats });
    } catch (error) {
      logger.error(`Error fetching governorate shipment stats: ${error.message}`);
      res.status(500).json({ message: "Error fetching stats" });
    }
  };

const getSessionMetrics = async (req, res) => {
  try {
    const metrics = await reportService.getSessionMetrics();
    logger.info("Session metrics fetched successfully.");
    res.status(200).json({ message: "Metrics fetched successfully", data: metrics });
  } catch (error) {
    logger.error(`Error fetching session metrics: ${error.message}`);
    res.status(500).json({ message: "Error fetching session metrics" });
  }
};

const getCourierInfoReport = async (req, res) => {
  try {
    const couriers = await reportService.getCourierInfoReport();
    res.status(200).json({ couriers });
  } catch (error) {
    logger.error(`Error fetching courier report: ${error.message}`);
    res.status(500).json({ message: "Error fetching courier report" });
  }
};

const getCourierShipmentReport = async (req, res) => {
  try {
    const report = await reportService.getCourierShipmentReport();
    res.status(200).json({ couriers: report });
  } catch (error) {
    logger.error(`Error fetching courier shipment report: ${error.message}`);
    res.status(500).json({ message: "Error fetching courier shipment report" });
  }
};

const getCourierFinancialMetrics = async (req, res) => {
  try {
    const report = await reportService.getCourierFinancialMetrics();
    res.status(200).json({ couriers: report });
  } catch (error) {
    logger.error(`Error fetching courier financial metrics: ${error.message}`);
    res.status(500).json({ message: "Error fetching courier financial metrics" });
  }
};

const getCourierPerformanceMetrics = async (req, res) => {
  try {
    const report = await reportService.getCourierPerformanceMetrics();
    res.status(200).json({ couriers: report });
  } catch (error) {
    logger.error(`Error fetching courier performance metrics: ${error.message}`);
    res.status(500).json({ message: "Error fetching courier performance metrics" });
  }
};

const getCourierLocationCoverage = async (req, res) => {
  try {
    const locationCoverage = await reportService.getCourierLocationCoverage();
    logger.info("Retrieved location and area coverage for couriers");
    res.status(200).json({ message: "Location coverage data retrieved", data: locationCoverage });
  } catch (error) {
    logger.error(`Error retrieving location coverage: ${error.message}`);
    res.status(500).json({ message: "Error retrieving location coverage" });
  }
};

const getCourierGeographicShipmentDistribution = async (req, res) => {
  try {
    const distributionData = await reportService.getCourierGeographicShipmentDistribution();
    logger.info("Retrieved geographic shipment distribution for couriers");
    res.status(200).json({ message: "Geographic shipment distribution retrieved", data: distributionData });
  } catch (error) {
    logger.error(`Error retrieving geographic shipment distribution: ${error.message}`);
    res.status(500).json({ message: "Error retrieving geographic shipment distribution" });
  }
};

const getCourierSessionMetrics = async (req, res) => {
  try {
    const metrics = await reportService.getCourierSessionMetrics();
    res.status(200).json({
      message: "Courier session metrics retrieved successfully",
      data: metrics,
    });
  } catch (error) {
    console.error(`Error fetching courier session metrics: ${error.message}`);
    res.status(500).json({ message: "Error fetching session metrics" });
  }
};

const getCourierSchedules = async (req, res) => {
  try {
    const schedules = await reportService.getCourierSchedules();
    res.status(200).json({
      message: "Courier schedules retrieved successfully",
      data: schedules,
    });
  } catch (error) {
    console.error(`Error fetching courier schedules: ${error.message}`);
    res.status(500).json({ message: "Error fetching courier schedules" });
  }
};

const getRecipientInfoReport = async (req, res) => {
  try {
    const data = await reportService.getRecipientInfoReport();
    res.status(200).json({ message: "Recipient information report", data });
  } catch (error) {
    logger.error(`Error fetching recipient info report: ${error.message}`);
    res.status(500).json({ message: "Error fetching recipient info report" });
  }
};

const getRecipientsShipmentActivityPerformance = async (req, res) => {
  try {
    const data = await reportService.getRecipientsShipmentActivityPerformance();
    res.status(200).json({ message: "Recipient shipment activity performance", data });
  } catch (error) {
    logger.error(`Error fetching shipment activity performance: ${error.message}`);
    res.status(500).json({ message: "Error fetching shipment activity performance" });
  }
};

const getRecipientReport = async (req, res) => {
  try {
    const data = await reportService.getRecipientReport();
    res.status(200).json({ message: "Recipient report data", data });
  } catch (error) {
    logger.error(`Error fetching recipient report: ${error.message}`);
    res.status(500).json({ message: "Error fetching recipient report" });
  }
};

const getAllShipmentReports = async (req, res) => {
  try {
    // Call the service to fetch the shipment report data
    const shipmentReports = await reportService.getAllShipmentReports();

    // Return the response
    res.json({ shipments: shipmentReports });
  } catch (error) {
    logger.error("Error generating shipment reports:", error);
    res.status(500).json({ message: "Failed to generate shipment reports." });
  }
};

const getPromocodeReport = async (req, res) => {
  try {
    const reportData = await reportService.generatePromocodeReport();

    res.status(200).json(reportData);
  } catch (error) {
    console.error("Error fetching promocode report:", error);
    res.status(500).json({ message: "Error fetching promocode report" });
  }
};

const getPenaltyReport = async (req, res) => {
  try {
    const penaltyReports = await reportService.getPenaltyReports();
    res.status(200).json(penaltyReports);
  } catch (error) {
    console.error("Error fetching penalty report:", error);
    res.status(500).json({ message: "Error fetching penalty report" });
  }
};

const getAdminUsersReport = async (req, res) => {
  try {
    const userReports = await reportService.getAllAdminUsers();
    res.status(200).json(userReports);
  } catch (error) {
    console.error("Error fetching user report:", error);
    res.status(500).json({ message: "Error fetching user report" });
  }
};

const getTransactionReport = async (req, res) => {
  try {
    const reportData = await reportService.getTransactionReport();
    res.status(200).json(reportData);
  } catch (error) {
    console.error("Error fetching transaction report:", error);
    res.status(500).json({ message: "Error fetching transaction report" });
  }
};

const getDetailedTransactionReport = async (req, res) => {
  try {
    const reportData = await reportService.getDetailedTransactionReport();
    res.status(200).json(reportData);
  } catch (error) {
    console.error("Error fetching transaction report:", error);
    res.status(500).json({ message: "Error fetching transaction report" });
  }
};

const getNotificationMetrics = async (req, res) => {
  try {
    const metrics = await reportService.getNotificationMetrics();
    res.status(200).json(metrics);
  } catch (error) {
    console.error("Error fetching notification metrics:", error);
    res.status(500).json({ message: "Error fetching notification metrics" });
  }
};

module.exports = {
  getAllShipmentReports,
  getRecipientReport,
  getRecipientsShipmentActivityPerformance,
  getAllSellersReport,
  getAllSendersShipmentActivity,
  getAllSendersFinancialMetrics,
  getPromotionsAndEngagementMetrics,
  getPaymentMetrics,
  getGovernorateShipmentStats,
  getSessionMetrics,
  getCourierInfoReport,
  getCourierShipmentReport,
  getCourierFinancialMetrics,
  getCourierPerformanceMetrics,
  getCourierLocationCoverage,
  getCourierGeographicShipmentDistribution,
  getCourierSessionMetrics,
  getCourierSchedules,
  getRecipientInfoReport,
  getPromocodeReport,
  getPenaltyReport,
  getAdminUsersReport,
  getTransactionReport,
  getDetailedTransactionReport,
  getNotificationMetrics
};
