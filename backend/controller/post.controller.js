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
          $or: [
            {
              $and: [
                { "isPrivate": { $eq: false } },
                { "_id": { $ne: new Mongoose.Types.ObjectId(userID) } },
              ]
            },
            {
              "userFollowers": { $in: [new Mongoose.Types.ObjectId(userID)] }
            }
          ],
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
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                user: "$_id",
                _id: "$posts._id",
                userName: "$userName",
                userProfile: "$userProfile"
              },
              "$posts"
            ]
          }
        }
      },
      {
        $project: {
          _id: 1,
          user: 1,
          userName: 1,
          userProfile: 1,
          postPoster: 1,
          postCaption: 1,
          postCreatedAt: 1,
          commentCount: 1,
          postLikes: {$size : "$likedBy"},
        }
      }
    ])
    if (postData.length > 0) {
      response.send({ success: true, posts: postData });
    } else {
      response.send({ success: false, posts: postData });
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
    const { instaUserID } = request.params;
    const currentUser = await userCollection.findById(instaUserID).select("userFollowing");
    const postData = await userCollection.aggregate([
      {
        $match: {
          isPrivate: false,
          _id: {
            $nin: currentUser.userFollowing
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
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                user: "$_id",
                _id: "$posts._id",
                userName: "$userName",
                userProfile: "$userProfile"
              },
              "$posts"
            ]
          }
        }
      },
      {
        $project: {
          _id: 1,
          user: 1,
          userName: 1,
          userProfile: 1,
          postPoster: 1,
          postCaption: 1,
          postCreatedAt: 1,
          commentCount: 1,
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

const likePosts = async (request, response) => {
  try {
    const { postID } = request.body;
    const { currentUser } = request.params;
    const findPost = await postCollection.updateOne({ _id: postID, "likedBy.user": { $ne: currentUser } }, {
      $push: { likedBy: { user: currentUser, likedAt: Date.now() } }
    },)
    const findUser = await userCollection.updateOne({ _id: currentUser }, { $addToSet: { likedPost: postID } });

    if (findPost.modifiedCount === 1 & findUser.modifiedCount === 1) {
      response.status(200).json({
        success: true,
        msg: "Successfully like the post"
      })
    } else {
      response.status(200).json({
        success: false,
        msg: "Post is already liked by you."
      })
    }

  } catch (err) {
    response.send({ success: false, msg: err.message });
  }
}

const unLikePosts = async (request, response) => {
  try {
    const { postID } = request.body;
    const { currentUser } = request.params;
    const findPost = await postCollection.updateOne({ _id: postID }, {
      $pull: { likedBy: { user: currentUser } }
    },)
    const findUser = await userCollection.updateOne({ _id: currentUser }, { $pull: { likedPost: postID } });

    if (findPost.modifiedCount === 1 & findUser.modifiedCount === 1) {
      response.status(200).json({
        success: true,
        msg: "Remove from like collection"
      })
    } else {
      response.send({
        success: false,
        msg: "Post not found"
      })
    }

  } catch (err) {
    response.send({ success: false, msg: err.message });
  }
}
module.exports = {
  createPost,
  getAllPosts,
  savePost,
  deleteSavePostFromCollection,
  explorerPosts,
  likePosts,
  unLikePosts
};
