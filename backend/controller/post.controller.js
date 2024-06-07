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
    const mongooseResponse = await postCollection.find({ user: userID })
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

const getSavePost = async (request, response) => {
  try {
    const { instaUserID } = request.params;
    const mongooseResponse = await userCollection.findOne({ _id: instaUserID }).populate('savedPost.post', '_id postPoster postComments postLikes').select("savedPost");

    if (mongooseResponse) {
      response.status(200).json({
        success: true,
        savePosts: mongooseResponse.savedPost
      })
    } else {
      response.status(404).json({
        success: false,
        savePosts: mongooseResponse.savedPost
      })
    }

  } catch (err) {
    response.status(500).json({
      success: false,
      msg: `Server failed to load, Try again later - ${err.message}`,
    })
  }
}

module.exports = {
  createPost,
  getPost,
  getAllPosts,
  savePost,
  deleteSavePostFromCollection,
  getSavePost
};
