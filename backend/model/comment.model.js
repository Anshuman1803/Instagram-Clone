const mongoose = require("mongoose");
const commentModel = mongoose.Schema({
    postID: {
        type: String,
        required: true,
    },
    commentText: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    userID:{
        type: String,
        required: true,
    },
    userProfile: {
        type: String,
    },
    createAt: {
        type: Number,
        required: true,
    }
});
const commentCollection = mongoose.model("comments", commentModel);
module.exports = { commentCollection }