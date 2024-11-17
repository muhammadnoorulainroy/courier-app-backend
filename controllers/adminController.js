const adminService = require("../services/adminService");
const logger = require("../config/logger");

const getDashboardStats = async (req, res) => {
  const { dateRange } = req.query;

  try {
    const stats = await adminService.getDashboardStats(dateRange);
    logger.info("Dashboard stats retrieved successfully.");
    res.json(stats);
  } catch (error) {
    logger.error(`Error retrieving dashboard stats: ${error.message}`);
    res.status(500).json({ message: "Error retrieving dashboard stats" });
  }
};

const addAdmin = async (req, res) => {
  try {
    const newAdmin = await adminService.addAdmin(req.body);
    logger.info(`Admin added successfully with userId: ${newAdmin.userId}`);
    res
      .status(201)
      .json({ message: "Admin added successfully", data: newAdmin });
  } catch (error) {
    logger.error(`Error adding admin: ${error.message}`);
    res.status(500).json({ message: "Error adding admin" });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const admins = await adminService.getAllAdmins();
    logger.info("Fetched all admins successfully");
    res.status(200).json({ data: admins });
  } catch (error) {
    logger.error(`Error fetching admins: ${error.message}`);
    res.status(500).json({ message: "Error fetching admins" });
  }
};

const updateAdmin = async (req, res) => {
  const { userId } = req.params;
  try {
    const updatedAdmin = await adminService.updateAdmin(userId, req.body);
    if (!updatedAdmin) {
      logger.warn(`Admin with userId ${userId} not found.`);
      return res.status(404).json({ message: "Admin not found" });
    }
    logger.info(`Admin updated successfully with userId: ${userId}`);
    res
      .status(200)
      .json({ message: "Admin updated successfully", data: updatedAdmin });
  } catch (error) {
    logger.error(`Error updating admin: ${error.message}`);
    res.status(500).json({ message: "Error updating admin" });
  }
};

const deleteAdmin = async (req, res) => {
  const { userId } = req.params;
  try {
    const deletedAdmin = await adminService.deleteAdmin(userId);
    if (!deletedAdmin) {
      logger.warn(`Admin with userId ${userId} not found.`);
      return res.status(404).json({ message: "Admin not found" });
    }
    logger.info(`Admin deleted successfully with userId: ${userId}`);
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting admin: ${error.message}`);
    res.status(500).json({ message: "Error deleting admin" });
  }
};

module.exports = {
  getDashboardStats,
  addAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
};
