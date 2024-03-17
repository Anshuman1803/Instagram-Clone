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
});
const userCollection = mongoose.model("users", userModel);

module.exports = { userCollection };
