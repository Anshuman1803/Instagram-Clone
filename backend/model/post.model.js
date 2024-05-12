const mongoose = require("mongoose");
const postModel = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  userName: {
    type: String,
  },
  userProfile: {
    type: String,
  },
  postPoster: {
    type: String,
    required: true,
  },
  postCaption: {
    type: String,
  },
  postCreatedAt: {
    type: Number,
  },
  postComments: {
    type: Number,
  },
  postLikes: {
    type: Number,
  }
});
const postCollection = mongoose.model("posts", postModel);

module.exports = { postCollection };