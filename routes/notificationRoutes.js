const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const validateRequest = require("../middlewares/validateRequest");
const { notificationValidator } = require("../validators/notificationValidator");

router.post("/", validateRequest(notificationValidator), notificationController.createNotification);
router.get("/", notificationController.getAllNotifications);
router.get("/scheduled", notificationController.getScheduledNotifications);
router.get("/:recipientType/:recipientId", notificationController.getNotificationsForUser);
router.put("/:notificationId", notificationController.editNotification);
router.delete("/:notificationId", notificationController.deleteNotification);

module.exports = router;
