const { emailSender } = require("../helper/Email");
const bcrypt = require("bcrypt");
const { userCollection } = require("../model/user.model");
const otpGenerator = require("otp-generator");
const JWT = require("jsonwebtoken");
const dotENV = require("dotenv");
dotENV.config();
const KEY = process.env.secretKey;
const saltRound = process.env.saltRound;

// authenticate user
const authenticateUser = async (request, response) => {
  const { Token } = request.body;
  try {
    const payload = JWT.verify(Token, KEY);
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
    `Hi ${userName},\n Thank you for signing up for Instagram-Clone. To verify your email address, please enter the following one-time passcode (OTP) in the Instagram-Clone web application:\n\n ${OTP}\n Once you have entered the OTP, your email address will be verified and you will be able to log in to Instagram-Clone. If you have any questions, please do not hesitate to contact us.\n\n Sincerely,\n\nThe Instagram-Clone support team\n\nContact : +917061751101, +917718676559`
  );

  if (emailResponse.messageId) {
    return response.send({
      sendOTP: OTP,
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
  //hashing password using bcrypt
  userPassword = bcrypt.hashSync(userPassword, saltRound);

  // saving new user in database
  const registredResult = await userCollection.create({
    userName: userName,
    fullName: fullName,
    userEmail: userEmail,
    userPassword: userPassword,
  });
  if (registredResult) {
    return response.send({ resMsg: "User Registred Successfully" });
  } else {
    return response.send({ resMsg: "Something Went Wrong, Try Again" });
  }
};

// User login controller
const userSignIn = async (request, response) => {
  const tempUser = request.body;

  const isUserExists = await userCollection.findOne({
    $or: [{ userEmail: tempUser.userID }, { userName: tempUser.userID }],
  });

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
    return response.send({ msg: "Wrong Password" });
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
    `Hi ${isUserExists?.userName},\nYou are receiving this email because you (or someone else) have requested the reset the password of your account.\n\n To reset your password, please enter the following one-time passcode (OTP) in the Instagram-Clone web application:\n\n ${OTP}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\nIf you have any questions, please do not hesitate to contact us.\n\n Sincerely,\n\nThe Instagram-Clone support team\n\nContact : +917061751101, +917718676559`
  );

  if (emailResponse.messageId) {
    return response.send({
      sendOTP: OTP,
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
  let { userEmail, newPassword } = request.body;

  newPassword = bcrypt.hashSync(newPassword, 15);
  const mongooseResponse = await userCollection.updateOne(
    { userEmail: userEmail },
    { userPassword: newPassword }
  );
  if (mongooseResponse.acknowledged) {
    return response.send({
      success: true,
      msg: "Password reset successfully",
    });
  } else {
    return response.send({
      success: false,
      msg: "Try Again",
    });
  }
};

// get the registred user using their _id
const getUser = async (request, response) => {};

module.exports = {
  userRegister,
  userSignIn,
  getUser,
  otpSender,
  forgotPassword,
  resetPassword,
  authenticateUser,
};
