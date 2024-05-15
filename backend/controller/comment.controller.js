const { commentCollection } = require("../model/comment.model");
const { postCollection } = require("../model/post.model")

const createNewComment = async (request, response) => {
    try {
        const { postID, commentText, userName, userProfile, createAt, userID } = request.body;

        const mongooseResponse = await commentCollection.create({
            postID: postID,
            commentText: commentText,
            userName: userName,
            userProfile: userProfile,
            createAt: createAt,
            userID: userID,
        });
        if (mongooseResponse) {
            await postCollection.findOneAndUpdate({ _id: postID }, {
                $inc: { postComments: 1 },
            })
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
        const mongooseResponse = await commentCollection.find({ postID: postId });
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

}

module.exports = {
    createNewComment,
    getComments,
    deleteComment,
}
