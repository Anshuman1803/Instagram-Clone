const mongoose = require("mongoose");
const userModel = mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userPassword: {
    type: String,
    required: true,
  },
  userFollowers: {
    type: Number,
  },
  userFollowing: {
    type: Number,
  },
  userPosts: {
    type: Number,
  },
  userBio: {
    type: String
  },
  userProfile: {
    type: String
  },
  createdAt: {
    type: Number,
  },
  savedPost: [
    {
      post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
      },
      _id: { type: mongoose.Schema.Types.ObjectId, auto: false }
    }
  ],

});
const userCollection = mongoose.model("users", userModel);

module.exports = { userCollection };
