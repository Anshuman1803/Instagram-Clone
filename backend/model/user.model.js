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
  gender: {
    type: String,
  },
  userPassword: {
    type: String,
    required: true,
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
  userFollowers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      _id: { type: mongoose.Schema.Types.ObjectId, auto: false }
    }
  ],
  userFollowing: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      _id: { type: mongoose.Schema.Types.ObjectId, auto: false }
    }
  ],
  savedPost: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
      _id: { type: mongoose.Schema.Types.ObjectId, auto: false }
    }
  ],
  gender: {
    type: String,
  },
  website: {
    type: String,
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
});
const userCollection = mongoose.model("users", userModel);

module.exports = { userCollection };
