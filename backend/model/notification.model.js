const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2")

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
        enum : ["like", "comment","follow","post"],
      },
      createdAt : {
        type : Number,
      },
});

notificationModel.plugin(aggregatePaginate);
const notificationCollection = mongoose.model("notifications", notificationModel);
module.exports = { notificationCollection }