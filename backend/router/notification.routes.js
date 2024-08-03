const notificationRoutes = require("express").Router();

const { addNewNotifications, getNotifications, getNotificationCount } = require("../controller/notification.controller");
const { userAuthenticate } = require("../middleware/Authenticate");

notificationRoutes.post("/create/new-notification", addNewNotifications);
notificationRoutes.get("/get-notifications/:currentUser", getNotifications);
notificationRoutes.get("/get/notification-count/:currentUser", getNotificationCount);

module.exports = { notificationRoutes };