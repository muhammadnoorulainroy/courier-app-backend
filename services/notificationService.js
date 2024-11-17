const Notification = require("../models/notificationModel");

const createNotification = async (data) => {
  const notification = new Notification(data);
  return await notification.save();
};

const getAllNotifications = async () => {
  return await Notification.find().sort({ createdAt: -1 });
};

const getNotificationsForUser = async (recipientId, recipientType) => {
  return await Notification.find({
    recipients: {
      $elemMatch: {
        recipientId,
        recipientType,
      },
    },
  }).sort({ createdAt: -1 });
};

const getScheduledNotifications = async () => {
  return await Notification.find({ status: "Scheduled" }).sort({ schedule: 1 });
};

const editNotification = async (notificationId, data) => {
  return await Notification.findOneAndUpdate({ notificationId }, data, { new: true });
};

const deleteNotification = async (notificationId) => {
  return await Notification.findOneAndDelete({ notificationId });
};

module.exports = {
  createNotification,
  getAllNotifications,
  getNotificationsForUser,
  getScheduledNotifications,
  editNotification,
  deleteNotification,
};
