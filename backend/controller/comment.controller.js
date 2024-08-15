const { commentCollection } = require("../model/comment.model");
const Mongoose = require("mongoose");

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
};

const getComments = async (request, response) => {
  try {
    const { postId } = request.params;
    const { page } = request.query;
    const commentData = commentCollection.aggregate([
      {
        $match: { postID: new Mongoose.Types.ObjectId(postId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
        },
      },
      {
        $project: {
          _id: 1,
          postID: 1,
          commentText: 1,
          createAt: 1,
          "user._id": 1,
          "user.userName": 1,
          "user.userProfile": 1,
        },
      },
    ]);
    const options = {
      page: parseInt(page) || 1,
      limit: 3,
      lean: true,
      customLabels: {
        docs: "data",
        meta: "meta",
      },
    };
    commentCollection
      .aggregatePaginate(commentData, options)
      .then((result) => {
        if (result.data.length > 0) {
          response.send({
            success: true,
            comments: result.data,
            meta: result.meta,
          });
        } else {
          response.send({
            success: false,
            comments: result.data,
            meta: result.meta,
          });
        }
      })
      .catch((error) => {
        response.send({ success: false, msg: error.message });
      });
  } catch (error) {
    response.status(500).send(`Server failed to load! Try again ${error}`);
  }
};

const deleteComment = async (request, response) => {
  try {
    const { commentId } = request.params;
    const { postID } = request.query;

    const mongooseResponse = await commentCollection.findOneAndDelete({
      _id: commentId,
    });
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
    console.log(error);
    response.status(500).send(`Server failed to load! Try again ${error}`);
  }
};

module.exports = {
  createNewComment,
  getComments,
  deleteComment,
};
