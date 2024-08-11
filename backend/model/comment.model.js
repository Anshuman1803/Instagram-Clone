const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2")

const commentModel = mongoose.Schema({
    postID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
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

commentModel.plugin(aggregatePaginate);
const commentCollection = mongoose.model("comments", commentModel);
module.exports = { commentCollection }