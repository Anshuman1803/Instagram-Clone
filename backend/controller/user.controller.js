const { emailSender } = require("../helper/Email");
const bcrypt = require("bcrypt");
const { userCollection } = require("../model/user.model");
const otpGenerator = require("otp-generator");

const userSignIn = async (requet, response) => {};

const userRegister = async (requet, response) => {
  let { userName, fullName, userEmail, userPassword } = requet.body;
  //hashing password using bcrypt
  userPassword = bcrypt.hashSync(userPassword, 15);

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

const otpSender = async (requet, response) => {
  const { userEmail, userName } = requet.body;
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
  response.send(emailResponse);
};

const getUser = async (request, response) => {};

module.exports = { userRegister, userSignIn, getUser, otpSender };
