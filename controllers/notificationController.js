const notificationService = require("../services/notificationService");
const logger = require("../config/logger");

const createNotification = async (req, res) => {
  try {
    const notification = await notificationService.createNotification(req.body);
    logger.info("Notification created successfully");
    res.status(201).json({ message: "Notification created successfully", notification });
  } catch (error) {
    logger.error(`Error creating notification: ${error.message}`);
    res.status(500).json({ message: "Error creating notification" });
  }
};

const getAllNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getAllNotifications();
    logger.info("Fetched all notifications successfully");
    res.status(200).json({ notifications });
  } catch (error) {
    logger.error(`Error fetching notifications: ${error.message}`);
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

const getNotificationsForUser = async (req, res) => {
  try {
    const { recipientId, recipientType } = req.params;
    const notifications = await notificationService.getNotificationsForUser(recipientId, recipientType);
    logger.info(`Fetched notifications for ${recipientType} ${recipientId}`);
    res.status(200).json({ notifications });
  } catch (error) {
    logger.error(`Error fetching notifications for user: ${error.message}`);
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

const getScheduledNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getScheduledNotifications();
    logger.info("Fetched scheduled notifications successfully");
    res.status(200).json({ notifications });
  } catch (error) {
    logger.error(`Error fetching scheduled notifications: ${error.message}`);
    res.status(500).json({ message: "Error fetching scheduled notifications" });
  }
};

const editNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const updatedNotification = await notificationService.editNotification(notificationId, req.body);
    logger.info(`Notification ${notificationId} updated successfully`);
    res.status(200).json({ message: "Notification updated successfully", updatedNotification });
  } catch (error) {
    logger.error(`Error updating notification: ${error.message}`);
    res.status(500).json({ message: "Error updating notification" });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    await notificationService.deleteNotification(notificationId);
    logger.info(`Notification ${notificationId} deleted successfully`);
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting notification: ${error.message}`);
    res.status(500).json({ message: "Error deleting notification" });
  }
};

module.exports = {
  createNotification,
  getAllNotifications,
  getNotificationsForUser,
  getScheduledNotifications,
  editNotification,
  deleteNotification,
};
