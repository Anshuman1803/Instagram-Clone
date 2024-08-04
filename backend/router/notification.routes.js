const notificationRoutes = require("express").Router();

const { addNewNotifications, getNotifications, getNotificationCount, markNotificationAsRead, markAllNotificationAsRead,deleteNotification} = require("../controller/notification.controller");
const { userAuthenticate } = require("../middleware/Authenticate");

notificationRoutes.post("/create/new-notification", addNewNotifications);
notificationRoutes.patch("/mark-notification-as-read/:notificationID", markNotificationAsRead);
notificationRoutes.patch("/mark-All-notification-as-read/:owner", markAllNotificationAsRead);
notificationRoutes.delete("/delete-notification/:notificationID", deleteNotification);
notificationRoutes.get("/get-notifications/:currentUser", getNotifications);
notificationRoutes.get("/get/notification-count/:currentUser", getNotificationCount);

module.exports = { notificationRoutes };