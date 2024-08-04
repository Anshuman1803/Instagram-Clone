const notificationRoutes = require("express").Router();

const { addNewNotifications, getNotifications, getNotificationCount, markNotificationAsRead, markAllNotificationAsRead,deleteNotification} = require("../controller/notification.controller");
const { userAuthenticate } = require("../middleware/Authenticate");

notificationRoutes.post("/create/new-notification",userAuthenticate, addNewNotifications);
notificationRoutes.patch("/mark-notification-as-read/:notificationID", userAuthenticate,markNotificationAsRead);
notificationRoutes.patch("/mark-All-notification-as-read/:owner",userAuthenticate, markAllNotificationAsRead);
notificationRoutes.delete("/delete-notification/:notificationID",userAuthenticate, deleteNotification);
notificationRoutes.get("/get-notifications/:currentUser", userAuthenticate,getNotifications);
notificationRoutes.get("/get/notification-count/:currentUser", getNotificationCount);

module.exports = { notificationRoutes };