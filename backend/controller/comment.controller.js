const { commentCollection } = require("../model/comment.model");

const createNewComment = async (request, response) => {
    try {
        const { postID, commentText, userID } = request.body;

        const mongooseResponse = await commentCollection.create({
            postID: postID,
            commentText: commentText,
            createAt: Date.now(),
            user: userID,
        });
        if (mongooseResponse) {
            response.status(200).json({
                success: true,
                msg: "Your comment has been created",
            });
        } else {
            response.status(400).json({
                success: false,
                msg: "Try again later",
            });
        }

    } catch (error) {
        response.status(500).send(`Server failed to load! Try again ${error}`);
    }
}

const getComments = async (request, response) => {
    try {
        const { postId } = request.params;
        const mongooseResponse = await commentCollection.find({ postID: postId }).populate('user', '_id userName userProfile');
        if (mongooseResponse) {
            response.status(200).json({
                success: true,
                comments: mongooseResponse,
            });
        } else {
            response.status(400).json({
                success: false,
                comments: mongooseResponse,
            });
        }

    } catch (error) {
        response.status(500).send(`Server failed to load! Try again ${error}`);
    }
}

const deleteComment = async (request, response) => {
    try {
        const { commentId } = request.params;
        const { postID } = request.query

        const mongooseResponse = await commentCollection.findOneAndDelete({ _id: commentId })
        if (mongooseResponse) {
            response.status(200).json({
                success: true,
                msg: "Your comment has been deleted",
            });
        } else {
            response.status(400).json({
                success: false,
                msg: "Comment not found",
            });
        }
    } catch (error) {
        console.log(error)
        response.status(500).send(`Server failed to load! Try again ${error}`);
    }
}

module.exports = {
    createNewComment,
    getComments,
    deleteComment,
}
