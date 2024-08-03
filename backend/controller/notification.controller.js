const { notificationCollection } = require("../model/notification.model");
const Mongoose = require("mongoose");

// new notifications add to the database
const addNewNotifications = async (request, response) => {
  try {
    const { owner, postID, userID, notificationText, notificationStatus, notificationType, createdAt } =
      request.body;
    const savedNotification = await notificationCollection.findOneAndUpdate(
      // filter documents based on these fields
      {
        owner,
        postID,
        userID,
        notificationStatus,
        notificationType,
      },
      //   updated fields
      {
        owner,
        postID,
        userID,
        notificationText,
        notificationStatus,
        notificationType,
        createdAt,
      },
      //   options
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
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
        $lookup: {
          from: "posts",
          localField: "postID",
          foreignField: "_id",
          as: "post",
        },
      },
      {
        $unwind: "$post",
      },
      {
        $project: {
          _id: 1,
          notificationStatus: 1,
          createdAt: 1,
          notificationText: {
            $cond: {
              if: { $eq: ["$notificationType", "like"] },
              then: { $concat: ["$user.userName", " liked your post"] },
              else: { $concat: ["$user.userName", " commented on your post"] }
            }
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
      response.status(404).json({
        success: false,
        notificationCount: 0,
      });
    }
  } catch (error) {
    response.status(500).send(`Server failed to load! Try again ${error.message}`);
  }
};

module.exports = { addNewNotifications, getNotifications, getNotificationCount };
