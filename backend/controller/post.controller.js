const { postCollection } = require("../model/post.model");
const { userCollection } = require("../model/user.model");
const { uploadOnCloudnary } = require("../service/cloudinary");

const createPost = async (request, response) => {
  const { user, postCreatedAt, postCaption, } = request.body;
  try {
    const cloudnaryResponse = await uploadOnCloudnary(request.file.path);

    const mongooseResponse = await postCollection.create({
      user: user,
      postCreatedAt: postCreatedAt,
      postPoster: cloudnaryResponse.secure_url,
      postCaption: postCaption,
      postComments: 0,
      postLikes: 0,
    });

    if (mongooseResponse) {
      const updateResponse = await userCollection.updateOne(
        { _id: user },
        {
          $inc: { userPosts: 1 },
        }
      );

      if (updateResponse.acknowledged) {
        response.send({ success: true });
      }
    } else {
      response.send({ success: false });
    }
  } catch (err) {
    response.send({ success: false, err: err });
  }
};

const getPost = async (request, response) => {
  try {
    const { userID } = request.params;
    const mongooseResponse = await postCollection.find({ user: userID }).populate('user', '_id userName userProfile');
    if (mongooseResponse) {
      response.send({ success: true, posts: mongooseResponse });
    } else {
      response.send({ success: false, posts: [] });
    }
  } catch (err) {
    response.send({ success: false, msg: err });
  }
};

const getAllPosts = async (request, response) => {
  try {
    const { userID } = request.params
    const mongooseResponse = await postCollection.find({ user: { $ne: userID } }).populate('user', '_id userName userProfile');
    if (mongooseResponse) {
      response.send({ success: true, posts: mongooseResponse });
    } else {
      response.send({ success: false, posts: [] });
    }
  } catch (err) {
    response.send({ success: false, msg: err });
  }
};
module.exports = {
  createPost,
  // deletePost,
  // updatePost,
  getPost,
  getAllPosts,
};
