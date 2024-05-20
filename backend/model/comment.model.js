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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },

    createAt: {
        type: Number,
        required: true,
    }
});
const commentCollection = mongoose.model("comments", commentModel);
module.exports = { commentCollection }