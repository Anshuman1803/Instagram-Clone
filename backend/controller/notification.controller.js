const { notificationCollection } = require("../model/notification.model");
const Mongoose = require("mongoose");

// new notifications add to the database
const addNewNotifications = async (request, response) => {
  try {
    const newNotification = request.body;
    const savedNotification = await notificationCollection.create({
      ...newNotification,
      createdAt: Date.now(),
    });
    if (savedNotification) {
      response.status(201).json({
        success: true,
      });
    }
  } catch (error) {
    response.status(500).send(`Server failed to load! Try again ${error.message}`);
  }
};

// get the notification
const getNotifications = async (request, response) => {
  try {
    const { currentUser } = request.params;
    const allNotifications = await notificationCollection.aggregate([
      {
        $match: {
          owner: new Mongoose.Types.ObjectId(currentUser),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userID",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $addFields: {
          postLookup: {
            $cond: {
              if: { $or: [{ $eq: ["$notificationType", "like"] }, { $eq: ["$notificationType", "comment"] },{ $eq: ["$notificationType", "post"] }] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "postID",
          foreignField: "_id",
          as: "post",
        },
      },
      {
        $addFields: {
          post: {
            $cond: {
              if: "$postLookup",
              then: { $arrayElemAt: ["$post", 0] },
              else: "$$REMOVE",
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          notificationStatus: 1,
          notificationType: 1,
          createdAt: 1,
          notificationText: {
            $cond: {
              if: { $eq: ["$notificationType", "like"] },
              then: { $concat: ["$user.userName", " liked your post"] },
              else: {
                $cond: {
                  if: { $eq: ["$notificationType", "comment"] },
                  then: { $concat: ["$user.userName", " commented on your post"] },
                  else: { 
                    $cond: {
                      if: { $eq: ["$notificationType", "follow"] },
                      then: {$concat: ["$user.userName", " started following you"] },
                      else: {
                        $cond: {
                          if: { $eq: ["$notificationType", "post"] },
                          then: {$concat: ["$user.userName", " posts new picture"] },
                          else: null,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "post._id": 1,
          "post.postPoster": 1,

          "user._id": 1,
          "user.userName": 1,
          "user.userProfile": 1,
        },
      },
    ]);

    if (allNotifications.length > 0) {
      response.status(200).json({
        success: true,
        notifications: allNotifications,
      });
    } else {
      response.status(404).json({
        success: false,
        notifications: allNotifications,
      });
    }
  } catch (error) {
    response.status(500).send(`Server failed to load! Try again ${error.message}`);
  }
};

// get the notification count
const getNotificationCount = async (request, response) => {
  try {
    const { currentUser } = request.params;
    const totalNotification = await notificationCollection.aggregate([
      {
        $match: {
          owner: new Mongoose.Types.ObjectId(currentUser),
          notificationStatus: "unread",
        },
      },
      {
        $count: "totalCount",
      },
    ]);
    if (totalNotification.length > 0) {
      response.status(200).json({
        success: true,
        notificationCount: totalNotification[0].totalCount,
      });
    } else {
      response.status(200).json({
        success: false,
        notificationCount: 0,
      });
    }
  } catch (error) {
    response.status(500).send(`Server failed to load! Try again ${error.message}`);
  }
};

// mark the individual notification as read
const markNotificationAsRead = async (request, response) => {
  try {
    const { notificationID } = request.params;
    const findNotification = await notificationCollection.findOneAndUpdate(
      {
        _id: notificationID,
      },
      {
        notificationStatus: "read",
      }
    );
    if (findNotification) {
      response.status(200).json({
        success: true,
        msg: "Notification mark as read",
      });
    }
  } catch (error) {
    response.status(500).send(`Server failed to load! Try again ${error.message}`);
  }
};

// mark all notification as read
const markAllNotificationAsRead = async (request, response) => {
  try {
    const { owner } = request.params;

    const updatedNotification = await notificationCollection.updateMany(
      {
        owner: owner,
      },
      {
        notificationStatus: "read",
      }
    );

    if (updatedNotification.modifiedCount > 0) {
      response.status(200).json({
        success: true,
        msg: "All notifications mark as read",
      });
    }
  } catch (error) {
    response.status(500).send(`Server failed to load! Try again ${error.message}`);
  }
};

// delete individual notification delete
const deleteNotification = async (request, response) => {
  try {
    const { notificationID } = request.params;
    const mongooseResponse = await notificationCollection.findByIdAndDelete(notificationID);
    if (mongooseResponse) {
      response.status(200).json({
        success: true,
        msg: "Notification deleted",
      });
    } else {
      response.status(400).json({
        success: false,
        msg: "Failed to delete notification",
      });
    }
  } catch (error) {
    response.status(500).send(`Server failed to load! Try again ${error.message}`);
  }
};

module.exports = {
  addNewNotifications,
  getNotifications,
  getNotificationCount,
  markNotificationAsRead,
  markAllNotificationAsRead,
  deleteNotification,
};
