const { postCollection } = require("../model/post.model");
const { userCollection } = require("../model/user.model");
const { uploadOnCloudnary } = require("../service/cloudinary");
const Mongoose = require("mongoose");

const createPost = async (request, response) => {
  const { user, postCreatedAt, postCaption, } = request.body;
  try {
    const cloudnaryResponse = await uploadOnCloudnary(request.file.path);

    const mongooseResponse = await postCollection.create({
      user: user,
      postCreatedAt: postCreatedAt,
      postPoster: cloudnaryResponse.secure_url,
      postCaption: postCaption,
      postLikes: 0,
    });

    if (mongooseResponse) {
      response.send({ success: true });
    } else {
      response.send({ success: false });
    }
  } catch (err) {
    response.send({ success: false, err: err });
  }
};

const getAllPosts = async (request, response) => {
  try {
    const { userID } = request.params;
    const postData = await userCollection.aggregate([
      {
        $match: {
          isPrivate: false,
          "_id": {
            $ne: { $ne: new Mongoose.Types.ObjectId(userID) }
          }
        }
      },
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'user',
          as: 'posts',
          pipeline: [
            {
              $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "postID",
                as: "comments"
              }
            },
            {
              $addFields: {
                commentCount: { $size: "$comments" }
              }
            }
          ]
        }
      },
      {
        $unwind: {
          path: "$posts",
        }
      },
      {
        $project: {
          "_id": 1,
          "userName": 1,
          "userProfile": 1,
          "posts.postPoster": 1,
          "posts._id": 1,
          "posts.postCaption": 1,
          "posts.postCreatedAt": 1,
          "posts.commentCount": 1,
          "posts.postLikes": 1,
        }
      }
    ])
    if (postData.length > 0) {
      response.send({ success: true, postDetails: postData });
    } else {
      response.send({ success: false, postDetails: postData });
    }
  } catch (err) {
    response.send({ success: false, msg: err.message });
  }
};

const savePost = async (request, response) => {
  try {
    const { postID } = request.params;
    const { instaUserID } = request.body;

    const existingPost = await userCollection.findOne({ _id: instaUserID, "savedPost": postID });

    if (existingPost) {
      response.status(200).json({
        success: false,
        msg: "Already saved in your collection."
      });
      return;
    }

    const mongooseUserUpdate = await userCollection.findOneAndUpdate({ _id: instaUserID }, { $push: { savedPost: postID } });

    if (mongooseUserUpdate) {
      response.status(200).json({
        success: true,
        msg: "Post saved successfully"
      })
    } else {
      response.status(404).json({
        success: false,
        msg: "Post not found"
      })
    }

  } catch (err) {
    response.status(500).json({
      success: false,
      msg: `Server failed to load, Try again later - ${err.message}`,
    })
  }
}

const deleteSavePostFromCollection = async (request, response) => {
  try {
    const { postID } = request.params;
    const { instaUserID } = request.body;
    const mongooseUserUpdate = await userCollection.findOneAndUpdate({ _id: instaUserID }, { $pull: { savedPost: postID } });

    if (mongooseUserUpdate) {
      response.status(200).json({
        success: true,
        msg: "Post removed from saved collection"
      })
    } else {
      response.status(404).json({
        success: false,
        msg: "Post is not found in your saved collection."
      })
    }

  } catch (err) {
    response.status(500).json({
      success: false,
      msg: `Server failed to load, Try again later - ${err.message}`,
    })
  }
}

const explorerPosts = async (request, response) => {
  try {
    const postData = await postCollection.aggregate([
      {
        $match: {}
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: "$user"
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'postID',
          as: 'comments'
        }
      },
      {
        $addFields: {
          postCommentsCount: {
            $size: "$comments"
          }
        }
      },
      {
        $project: {
          _id: 1,
          "user._id": 1,
          "user.userName": 1,
          "user.userProfile": 1,
          postPoster: 1,
          postCaption: 1,
          postCreatedAt: 1,
          postCommentsCount: 1,
          comments: 1,
          postLikes: 1,
        }
      }
    ])
    if (postData.length > 0) {
      response.send({ success: true, posts: postData });
    } else {
      response.send({ success: false, posts: postData });
    }
  }
  catch (err) {
    response.send({ success: false, msg: err.message });
  }
}

module.exports = {
  createPost,
  getAllPosts,
  savePost,
  deleteSavePostFromCollection,
  explorerPosts,
};
