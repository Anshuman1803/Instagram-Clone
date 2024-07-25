const Mongoose = require("mongoose");
const { emailSender } = require("../helper/Email");
const bcrypt = require("bcrypt");
const { userCollection } = require("../model/user.model");
const { otpCollection } = require("../model/otp.model");
const { postCollection } = require("../model/post.model");
const { commentCollection } = require("../model/comment.model");
const otpGenerator = require("otp-generator");
const dotENV = require("dotenv");
dotENV.config();
const { uploadOnCloudnary } = require("../service/cloudinary");

// Update user details
const updateUserDetails = async (request, response) => {
  try {
    const { userID } = request.params;
    const updateFields = {};
    const result = request.file && (await uploadOnCloudnary(request.file.path));
    request.body.userProfile = result && result?.secure_url;
    request.body.userProfilePublicID = result && result?.public_id;

    for (const key in request.body) {
      if (request.body[key] !== "null" && request.body[key] !== "" && request.body[key] !== " " && request.body[key]) {
        updateFields[key] = request.body[key];
      }
    }

    const findUser = await userCollection
      .findOneAndUpdate({ _id: userID }, updateFields, { new: true })
      .select("fullName userProfile userName");

    if (findUser) {
      response.status(200).json({
        success: true,
        msg: "User details updated successfully",
        updatedUser: findUser,
      });
    } else {
      response.status(404).json({
        success: false,
        msg: "No user found to update",
      });
    }
  } catch (error) {
    return response.send({ success: false, err: err });
  }
};

// Remove current user profile
const removeProfilePicture = async (request, response) => {
  try {
    const { userID } = request.params;
    const mongooseResponse = await userCollection.findOneAndUpdate(
      { _id: userID },
      {
        userProfile: "",
      }
    );
    if (mongooseResponse) {
      response.status(200).json({
        success: true,
        msg: "Profile picture removed successfully",
      });
    } else {
      response.send({
        success: false,
        msg: "No user found to update",
      });
    }
  } catch (error) {
    return response.send({ success: false, err: err });
  }
};

// Verify user passwords for account deletion
const verifyUserPassword = async (request, response) => {
  try {
    const { userID, userPassword } = request.body;

    const isUserExists = await userCollection.findOne({ _id: userID });

    if (!isUserExists) {
      return response.send({
        success: false,
        msg: `User not found`,
      });
    }

    // matching Password
    const userAuthenticaticated = bcrypt.compareSync(userPassword, isUserExists.userPassword);

    if (!userAuthenticaticated) {
      return response.send({ success: false, msg: "Wrong Password" });
    }

    // Generate the verification otp
    const OTP = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    // emailSender
    const emailResponse = await emailSender(
      isUserExists?.userEmail,
      "Confirmation of Account Deletion Request",
      `Dear ${isUserExists?.userName},\n\nWe have received your request to delete your account from Instagram-CLONE. To ensure the security and accuracy of this process, we need to verify your request.\n\n Please find your One-Time Password (OTP) for verification below:\n\n${OTP}\n\nIf you did not request this account deletion, please ignore this email and contact our support team immediately.If you have any others questions, please do not hesitate to contact us.\n\n Sincerely,\n\nThe Instagram-Clone support team\n\nContact : +917061751101`
    );

    if (emailResponse.messageId) {
      await otpCollection.create({
        userEmail: isUserExists?.userEmail,
        OTP: OTP,
        otpExpireAt: Date.now() + 300000, // 5-minute expiration,
      });

      return response.send({
        success: true,
        msg: "Otp Sent successfully",
      });
    } else {
      return response.send({
        success: false,
        msg: "Something went wrong, Try Again",
      });
    }
  } catch (error) {
    return response.send({ success: false, err: err });
  }
};

// delete user accounts and their related datas
const deleteUserAccount = async (request, response) => {
  try {
    const { OTP, userID } = request.body;

    const findUser = await userCollection.findOne({ _id: userID });
    const otpEntry = await otpCollection.find({ userEmail: findUser?.userEmail }).sort({ otpExpireAt: -1 }).limit(1);

    if (otpEntry.length === 0) {
      return response.send({ success: false, msg: "Invalid OTP" });
    }

    const now = Date.now();
    if (now > otpEntry[0].otpExpireAt) {
      await otpCollection.deleteMany({ userEmail: findUser?.userEmail });
      return response.send({ success: false, msg: "OTP has expired" });
    }

    if (OTP !== otpEntry[0].OTP) {
      return response.send({ success: false, msg: "Incorrect OTP" });
    } else {
      await userCollection.deleteOne({ _id: userID });
      await postCollection.deleteOne({ user: userID });
      await commentCollection.deleteOne({ user: userID });
      await otpCollection.deleteMany({ userEmail: findUser?.userEmail });
      return response.status(200).json({ success: true, msg: "Account deleted successfully." });
    }
  } catch (err) {
    return response.send({ success: false, err: err.message });
  }
};

// Search user based on search Text by user from search component
const searchUser = async (request, response) => {
  try {
    const { searchText } = request.body;
    const searchResult = await userCollection.aggregate([
      {
        $match: {
          $or: [
            { userName: { $regex: searchText, $options: "i" } },
            { fullName: { $regex: searchText, $options: "i" } },
          ],
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "user",
          as: "posts",
        },
      },
      {
        $addFields: {
          userPostsCount: { $size: "$posts" },
        },
      },
      {
        $project: {
          _id: 1,
          userName: 1,
          fullName: 1,
          userFollowers: 1,
          userFollowing: 1,
          userProfile: 1,
          userPostsCount: 1,
        },
      },
    ]);

    if (searchResult.length > 0) {
      response.status(200).json({
        success: true,
        searchResult: searchResult,
      });
    } else {
      response.status(200).json({
        success: false,
        searchResult: searchResult,
      });
    }
  } catch (err) {
    return response.send({ success: false, err: err.message });
  }
};

// Add to following list
const addUsersToFollowingList = async (request, response) => {
  try {
    const { followingUserID } = request.body;
    const { userID } = request.params;
    const updateFollowingUser = await userCollection.findOneAndUpdate(
      { _id: userID },
      { $addToSet: { userFollowing: followingUserID } }
    );
    const updateFollowersUser = await userCollection.findOneAndUpdate(
      { _id: followingUserID },
      { $addToSet: { userFollowers: userID } }
    );
    if (updateFollowingUser && updateFollowersUser) {
      response.status(200).json({
        success: true,
        msg: `You are started following the ${updateFollowersUser.userName}`,
      });
    } else {
      response.status(200).json({
        success: false,
        msg: `User not found`,
      });
    }
  } catch (err) {
    return response.send({
      success: false,
      msg: err.message,
    });
  }
};

// unfollow user
const unfollowUser = async (request, response) => {
  try {
    const { unfollowUserID } = request.body;
    const { userID } = request.params;
    const updateFollowingUser = await userCollection.findOneAndUpdate(
      { _id: userID },
      { $pull: { userFollowing: unfollowUserID } }
    );
    const updateFollowerUser = await userCollection.findOneAndUpdate(
      { _id: unfollowUserID },
      {
        $pull: { userFollowers: userID },
      }
    );

    if (updateFollowingUser && updateFollowerUser) {
      response.status(200).json({
        success: true,
        msg: `You unfollow ${updateFollowerUser.userName}`,
      });
    } else {
      response.status(200).json({
        success: false,
        msg: `User not found`,
      });
    }
  } catch (err) {
    return response.send({
      success: false,
      msg: err.message,
    });
  }
};

// get the registred user using their _id
const getUser = async (request, response) => {
  try {
    const { id } = request.params;
    const { currentUser } = request.query;

    const userData = await userCollection.aggregate([
      {
        $match: { _id: new Mongoose.Types.ObjectId(id) },
      },

      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "user",
          as: "posts",
          pipeline: [
            {
              $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "post",
                as: "comments",
              },
            },
            {
              $addFields: {
                commentCount: { $size: "$comments" },
              },
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
              $replaceRoot: {
                newRoot: {
                  $mergeObjects: [
                    {
                      _id: "$_id",
                      user: "$user._id",
                      userName: "$user.userName",
                      userProfile: "$user.userProfile",
                      postPoster: "$postPoster",
                      postCaption: "$postCaption",
                      postCreatedAt: "$postCreatedAt",
                      postLikes: { $size: "$likedBy" },
                      commentCount: "$commentCount",
                    },
                  ],
                },
              },
            },
          ],
        },
      },

      {
        $lookup: {
          from: "posts",
          localField: "savedPost",
          foreignField: "_id",
          as: "savedPost",
          pipeline: [
            {
              $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "post",
                as: "comments",
              },
            },
            {
              $addFields: {
                commentCount: { $size: "$comments" },
              },
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
              $replaceRoot: {
                newRoot: {
                  $mergeObjects: [
                    {
                      _id: "$_id",
                      user: "$user._id",
                      userName: "$user.userName",
                      userProfile: "$user.userProfile",
                      postPoster: "$postPoster",
                      postCaption: "$postCaption",
                      postCreatedAt: "$postCreatedAt",
                      postLikes: { $size: "$likedBy" },
                      commentCount: "$commentCount",
                    },
                  ],
                },
              },
            },
          ],
        },
      },

      {
        $addFields: {
          isOwner: {
            $cond: {
              if: { $eq: ["$_id", new Mongoose.Types.ObjectId(currentUser)] },
              then: true,
              else: false,
            },
          },
        },
      },

      {
        $addFields: {
          isFollowersOrOwner: {
            $cond: {
              if: {
                $or: [
                  { $eq: ["$isPrivate", false] },
                  { $in: [new Mongoose.Types.ObjectId(currentUser), "$userFollowers"] }, // Check if currentUser is in the followers array
                  "$isOwner",
                ],
              },
              then: true,
              else: false,
            },
          },
        },
      },

      {
        $project: {
          _id: 1,
          userName: 1,
          fullName: 1,
          userEmail: 1,
          userFollowers: 1,
          userFollowing: 1,
          userBio: 1,
          gender: 1,
          userProfile: 1,
          website: 1,
          isPrivate: 1,
          savedPost: {
            $cond: {
              if: "$isOwner",
              then: "$savedPost",
              else: null,
            },
          },
          posts: {
            $cond: {
              if: "$isFollowersOrOwner",
              then: "$posts",
              else: null,
            },
          },
          userPostsCount: { $size: "$posts" },
        },
      },
    ]);

    if (userData.length > 0) {
      return response.send({
        success: true,
        user: userData[0],
      });
    } else {
      return response.send({
        success: false,
        user: userData,
      });
    }
  } catch (err) {
    return response.send({
      success: false,
      msg: err.message,
    });
  }
};

// get the suggestedUser
const getSuggestedUser = async (request, response) => {
  const { id } = request.params;
  try {
    const mongooseResponse = await userCollection
      .find({ _id: { $ne: id } })
      .sort({ createdAt: -1 })
      .limit(7)
      .select("_id userName userProfile ");
    if (mongooseResponse) {
      return response.send({
        success: true,
        suggestedUser: mongooseResponse,
      });
    } else {
      return response.send({
        success: false,
      });
    }
  } catch (err) {
    return response.send({
      success: false,
    });
  }
};

// update the user data on every route changes in frontend
const getUpdateduserDetails = async (request, response) => {
  try {
    const { currentUser } = request.params;
    const userData = await userCollection.aggregate([
      {
        $match: {
          _id: new Mongoose.Types.ObjectId(currentUser),
        },
      },
      {
        $project: {
          _id: 1,
          userName: 1,
          userProfile: 1,
          fullName: 1,
          savedPost: 1,
          userFollowing: 1,
          userFollowers: 1,
          likedPost: 1,
        },
      },
    ]);
    if (userData.length > 0) {
      return response.status(200).json({
        success: true,
        UserDetails: userData[0],
      });
    } else {
      return response.status(200).json({
        success: false,
        UserDetails: userData[0],
      });
    }
  } catch (error) {
    response.send({
      success: false,
      msg: `Failed to fetch user details, Try again later - ${error.message}`,
    });
  }
};

// get the followers or following list of user based on requested data
const getFollowersList = async (request, response) => {
  try {
    const { currentUser } = request.params;
    const followerlist = await userCollection.aggregate([
      {
        $match: { _id: new Mongoose.Types.ObjectId(currentUser) },
      },
      {
        $lookup: {
          from: "users",
          localField: "userFollowers",
          foreignField: "_id",
          as: "userFollowers",
        },
      },
      {
        $unwind: "$userFollowers",
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$userFollowers"],
          },
        },
      },
      {
        $project: {
          _id: 1,
          userName: 1,
          userProfile: 1,
          fullName: 1,
        },
      },
    ]);

    if (followerlist.length > 0) {
      return response.status(200).json({
        success: true,
        followerlist: followerlist,
      });
    } else {
      return response.status(200).json({
        success: false,
        followerlist: followerlist,
      });
    }
  } catch (error) {
    response.send({ success: false, msg: error.message });
  }
};

// get the following list of user based on requested data
const getFollowingList = async (request, response) => {
  try {
    const { currentUser } = request.params;
    const followinglist = await userCollection.aggregate([
      {
        $match: { _id: new Mongoose.Types.ObjectId(currentUser) },
      },
      {
        $lookup: {
          from: "users",
          localField: "userFollowing",
          foreignField: "_id",
          as: "userFollowing",
        },
      },
      {
        $unwind: "$userFollowing",
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$userFollowing"],
          },
        },
      },
      {
        $project: {
          _id: 1,
          userName: 1,
          userProfile: 1,
          fullName: 1,
        },
      },
    ]);

    if (followinglist.length > 0) {
      return response.status(200).json({
        success: true,
        followinglist: followinglist,
      });
    } else {
      return response.status(200).json({
        success: false,
        followinglist: followinglist,
      });
    }
  } catch (error) {
    response.send({ success: false, msg: error.message });
  }
};

// Get About the account
const getAboutAccount = async (request, response) => {
  try {
    const { userID } = request.params;
    const aboutAccount = await userCollection.aggregate([
      {
        $match: {"_id" : new Mongoose.Types.ObjectId(userID)},
      },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "user",
          as: "posts",
        },
      },
      {
        $project : {
          _id: 1,
          userProfile: 1,
          userName : 1,
          createdAt : 1,
          postCount : { $size: "$posts" },
          followersCount : { $size: "$userFollowers" },
          followingCount : { $size: "$userFollowing" },
          userBio : 1,
          
        }
      }
    ]);

    if(aboutAccount.length > 0){
      response.status(200).json({
        success: true,
        aboutAccount: aboutAccount[0],
      });
    }else{
      response.status(404).json({
        success: false,
        aboutAccount: [],
      });
    }
  
  } catch (error) {
    response.status(500).json({
      success: false,
      msg: "Failed to get about the account, Try again later - " + error.message,
    });
  }
};
module.exports = {
  updateUserDetails,
  getUser,
  getSuggestedUser,
  getUpdateduserDetails,
  removeProfilePicture,
  verifyUserPassword,
  deleteUserAccount,
  searchUser,
  addUsersToFollowingList,
  getFollowersList,
  getFollowingList,
  unfollowUser,
  getAboutAccount,
};
