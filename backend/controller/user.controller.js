const Mongoose = require("mongoose")
const { emailSender } = require("../helper/Email");
const bcrypt = require("bcrypt");
const { userCollection } = require("../model/user.model");
const { otpCollection } = require("../model/otp.model")
const { postCollection } = require("../model/post.model");
const { commentCollection } = require("../model/comment.model");
const otpGenerator = require("otp-generator");
const JWT = require("jsonwebtoken");
const dotENV = require("dotenv");
dotENV.config();
const KEY = process.env.secretKey;
const { uploadOnCloudnary } = require("../service/cloudinary");

// authenticate user
const authenticateUser = async (request, response) => {
  const { instaTOKEN } = request.body;
  try {
    const payload = JWT.verify(instaTOKEN, KEY);
    return response.send({
      success: true,
    });
  } catch (error) {
    response.send({
      success: false,
    });
  }
};

// Sending  Account verifitying OTP emails
const otpSender = async (request, response) => {
  const { userEmail, userName } = request.body;
  const isUserExists = await userCollection.findOne({ userEmail: userEmail });
  const isUserNameavailable = await userCollection.findOne({
    userName: userName,
  });
  if (isUserExists) {
    return response.send({
      success: false,
      msg: `${userEmail} already registered`,
    });
  }
  if (isUserNameavailable) {
    return response.send({
      success: false,
      msg: `username already taken`,
    });
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
    userEmail,
    "Verify your email address",
    `Hi ${userName},\n Thank you for signing up for Instagram-Clone. To verify your email address, please enter the following one-time passcode (OTP) in the Instagram-Clone web application:\n\n ${OTP}\n Once you have entered the OTP, your email address will be verified and you will be able to log in to Instagram-Clone. If you have any questions, please do not hesitate to contact us.\n\n Sincerely,\n\nThe Instagram-Clone support team\n\nContact : +917061751101`
  );

  if (emailResponse.messageId) {
    await otpCollection.create({
      userEmail: userEmail,
      OTP: OTP,
      otpExpireAt: Date.now() + 300000 // 5-minute expiration,
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
};

// User registration controller
const userRegister = async (request, response) => {
  let { userName, fullName, userEmail, userPassword } = request.body;
  // hashing password using bcrypt
  userPassword = bcrypt.hashSync(userPassword, 15);

  // saving new user in database
  const registredResult = await userCollection.create({
    userName: userName,
    fullName: fullName,
    userEmail: userEmail,
    userPassword: userPassword,
    userFollowers: 0,
    userFollowing: 0,
    userPosts: 0,
    userBio: "",
    userProfile: "",
    createdAt: Date.now(),
    savedPost: [],
  });
  if (registredResult) {
    return response.send({ resMsg: "User Registred Successfully" });
  } else {
    return response.send({ resMsg: "Something Went Wrong, Try Again" });
  }
};

// User login controller
const userSignIn = async (request, response) => {
  try {
    const tempUser = request.body;


    const isUserExists = await userCollection.findOne({
      $or: [{ userEmail: tempUser.userID }, { userName: tempUser.userID }],
    })

    if (!isUserExists) {
      return response.send({
        success: false,
        msg: `User not registered`,
      });
    }
    // matching Password

    const userAuthenticaticated = bcrypt.compareSync(
      tempUser.userPassword,
      isUserExists.userPassword
    );

    if (userAuthenticaticated) {
      // creating json token
      const generatedToken = JWT.sign({ USER: tempUser.userEmail }, KEY, {
        expiresIn: "72h",
      });
      isUserExists.userPassword = undefined;
      return response.send({
        success: true,
        UserDetails: isUserExists,
        TOKEN: generatedToken,
      });
    } else {
      return response.send({ success: false, msg: "Wrong Password" });
    }
  } catch (error) {
    response.status(500).json({ msg: `Check your internet connect and Try again - ${error.message}` });
  }
};

// Sending the forgot password OTP emails to registered users
const forgotPassword = async (request, response) => {
  const { userEmail } = request.body;
  const isUserExists = await userCollection.findOne({ userEmail: userEmail });

  if (!isUserExists) {
    return response.send({
      success: false,
      msg: `${userEmail} not registered`,
    });
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
    userEmail,
    "Account - Reset password",
    `Hi ${isUserExists?.userName},\nYou are receiving this email because you (or someone else) have requested the reset the password of your account.\n\n To reset your password, please enter the following one-time passcode (OTP) in the Instagram-Clone web application:\n\n ${OTP}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\nIf you have any questions, please do not hesitate to contact us.\n\n Sincerely,\n\nThe Instagram-Clone support team\n\nContact : +917061751101`
  );

  if (emailResponse.messageId) {
    await otpCollection.create({
      userEmail: userEmail,
      OTP: OTP,
      otpExpireAt: Date.now() + 300000 // 5-minute expiration,
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
};

// Reset the verified user password
const resetPassword = async (request, response) => {
  try {
    let { userEmail, newPassword, instaUserID } = request.body;
    newPassword = bcrypt.hashSync(newPassword, 15);
    const mongooseResponse = await userCollection.updateOne(
      {
        $or: [{ userEmail: userEmail }, { _id: instaUserID }]
      },
      {
        $set: { userPassword: newPassword }
      }
    );

    if (mongooseResponse.acknowledged) {
      return response.send({
        success: true,
        msg: "Password update successfully",
      });
    } else {
      return response.send({
        success: false,
        msg: "Try Again",
      });
    }
  }
  catch (error) {
    response.status(500).json({
      success: false,
      msg: `Server failed to load, Try again later - ${error.message}`,
    })
  }
};

// Update user details
const updateUserDetails = async (request, response) => {
  try {
    const { userID } = request.params;
    const updateFields = {};
    const result = request.file && (await uploadOnCloudnary(request.file.path));
    request.body.userProfile = result && result?.secure_url;

    for (const key in request.body) {
      if (
        request.body[key] !== "null" &&
        request.body[key] !== "" &&
        request.body[key] !== " " &&
        request.body[key]
      ) {
        updateFields[key] = request.body[key];
      }
    }

    const findUser = await userCollection.findOneAndUpdate(
      { _id: userID },
      updateFields,
      { new: true }
    ).select("fullName userProfile userName")

    if (findUser) {
      response.status(200).json({
        success: true,
        msg: "User details updated successfully",
        updatedUser: findUser
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
    const mongooseResponse = await userCollection.findOneAndUpdate({ _id: userID }, {
      userProfile: ""
    });
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
}

// Verify user passwords for account deletion
const verifyUserPassword = async (request, response) => {
  try {
    const { userID, userPassword } = request.body;

    const isUserExists = await userCollection.findOne({ _id: userID })

    if (!isUserExists) {
      return response.send({
        success: false,
        msg: `User not found`,
      });
    }

    // matching Password
    const userAuthenticaticated = bcrypt.compareSync(
      userPassword,
      isUserExists.userPassword
    );

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
        otpExpireAt: Date.now() + 300000 // 5-minute expiration,
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
}

// delete user accounts and their related datas
const deleteUserAccount = async (request, response) => {
  try {
    const { OTP, userID } = request.body;

    const findUser = await userCollection.findOne({ _id: userID });
    const otpEntry = await otpCollection.find({ userEmail: findUser?.userEmail }).sort({ otpExpireAt: -1 }).limit(1);

    if (otpEntry.length === 0) {
      return response.send({ success: false, msg: 'Invalid OTP' });
    }

    const now = Date.now();
    if (now > otpEntry[0].otpExpireAt) {
      await otpCollection.deleteMany({ userEmail: findUser?.userEmail });
      return response.send({ success: false, msg: 'OTP has expired' });
    }

    if (OTP !== otpEntry[0].OTP) {
      return response.send({ success: false, msg: 'Incorrect OTP' });
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
}

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
          ]
        }
      },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "user",
          as: "posts",
        }
      },
      {
        $addFields: {
          userPostsCount: { $size: "$posts" }
        }
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
        }
      }
    ])

    if (searchResult.length > 0) {
      response.status(200).json({
        success: true,
        searchResult: searchResult
      })
    } else {
      response.status(200).json({
        success: false,
        searchResult: searchResult
      })
    }
  } catch (err) {
    return response.send({ success: false, err: err.message });
  }
}

// Add to following list
const addUsersToFollowingList = async (request, response) => {
  try {
    const { followingUserID } = request.body;
    const { userID } = request.params;
    const updateFollowingUser = await userCollection.findOneAndUpdate({ _id: userID }, { $addToSet: { userFollowing: followingUserID } },)
    const updateFollowersUser = await userCollection.findOneAndUpdate({ _id: followingUserID }, { $addToSet: { userFollowers: userID } },)
    if (updateFollowingUser && updateFollowersUser) {
      response.status(200).json({
        success: true,
        msg: `Successfully follow the ${updateFollowersUser.userName}`
      })
    } else {
      response.status(200).json({
        success: false,
        msg: `User not found`
      })
    }

  } catch (err) {
    return response.send({
      success: false,
      msg: err.message
    });
  }
}

// unfollow user
const unfollowUser = async (request, response) => {
  try {
    const { unfollowUserID } = request.body;
    const { userID } = request.params;
    const updateFollowingUser = await userCollection.findOneAndUpdate({ _id: userID }, { $pull: { userFollowing: unfollowUserID } },);
    const updateFollowerUser = await userCollection.findOneAndUpdate({ _id: unfollowUserID }, {
      $pull: { userFollowers: userID }
    },)


    if (updateFollowingUser && updateFollowerUser) {
      response.status(200).json({
        success: true,
        msg: `Successfully unfollow ${updateFollowerUser.userName}`
      })
    } else {
      response.status(200).json({
        success: false,
        msg: `User not found`
      })
    }

  } catch (err) {
    console.log(err)
    return response.send({
      success: false,
      msg: err.message
    });
  }
}

// get the registred user using their _id
const getUser = async (request, response) => {
  try {
    const { id } = request.params;
    const { currentUser } = request.query;

    const userData = await userCollection.aggregate([
      {
        $match: { '_id': new Mongoose.Types.ObjectId(id) }
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
                foreignField: "postID",
                as: "comments"
              }
            },
            {
              $addFields: {
                commentCount: { $size: "$comments" },
              }
            },
            {
              $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user"
              }
            },
            {
              $unwind: {
                path: "$user",
              }
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
                      postLikes: "$postLikes",
                      commentCount: "$commentCount",
                    },
                  ]
                }
              }
            }
          ]
        }
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
                foreignField: "postID",
                as: "comments"
              }
            },
            {
              $addFields: {
                commentCount: { $size: "$comments" },
              }
            },
            {
              $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user"
              }
            },
            {
              $unwind: {
                path: "$user",
              }
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
                      postLikes: "$postLikes",
                      commentCount: "$commentCount",
                    },
                  ]
                }
              }
            }
          ]
        }
      },


      {
        $addFields: {
          isOwnerOrFollower: {
            $cond: {
              if: {
                $or: [
                  {
                    $eq: ["$isPrivate", false]
                  },
                  {
                    $in: ["$currentUser", "$userFollowing"]
                  },
                  {
                    $eq: ["$_id", new Mongoose.Types.ObjectId(currentUser)]
                  }
                ]
              },
              then: true,
              else: false,
            }
          }
        }
      },

      {
        $addFields: {
          isOwner: {
            $cond: {
              if: { $eq: ["$_id", new Mongoose.Types.ObjectId(currentUser)] },
              then: true,
              else: false,
            }
          }
        }
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
          userProfile: 1,
          website: 1,
          userPostsCount: { $size: "$posts" },
          posts: {
            $cond: {
              if: "$isOwnerOrFollower",
              then: "$posts",
              else: [],
            }
          },
          savedPost: {
            $cond: {
              if: "$isOwner",
              then: "$savedPost",
              else: [],
            }
          },
          isPrivate: 1,
        }
      }

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
      msg: err.message
    });
  }
};

// get the suggestedUser
const getSuggestedUser = async (request, response) => {
  const { id } = request.params;
  try {
    const mongooseResponse = await userCollection.find({ _id: { $ne: id } }).sort({ createdAt: -1 }).limit(5).select('_id userName userProfile ');
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
}

module.exports = {
  userRegister,
  userSignIn,
  updateUserDetails,
  getUser,
  getSuggestedUser,
  otpSender,
  forgotPassword,
  resetPassword,
  authenticateUser,
  removeProfilePicture,
  verifyUserPassword,
  deleteUserAccount,
  searchUser,
  addUsersToFollowingList,
  unfollowUser
};
