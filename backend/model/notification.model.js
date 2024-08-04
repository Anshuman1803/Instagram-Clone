const mongoose = require("mongoose");
const notificationModel = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      postID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
      },
      userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      notificationText : {
        type : String,
        required : true,
      },
      
      notificationStatus : {
        type : String,
        enum : ["unread", "read"],
        default : "unread",
      },
      notificationType : {
        type : String,
        enum : ["like", "comment"],
      },
      createdAt : {
        type : Number,
      },
});
const notificationCollection = mongoose.model("notifications", notificationModel);
module.exports = { notificationCollection }