const { userSignIn, userRegister, getUser, getSuggestedUser, otpSender, forgotPassword, resetPassword, authenticateUser } = require("../controller/user.controller");
const userRoute = require("express").Router();
const { otpVerification } = require("../middleware/VerifyOTP")

userRoute.post("/verify/token", authenticateUser)
userRoute.post("/user/verify-account", otpSender)
userRoute.post("/user/register", otpVerification, userRegister);
userRoute.post("/user/signin", userSignIn);
userRoute.post("/user/password/forgot-password", forgotPassword);
userRoute.post("/user/password/reset-password", resetPassword);
userRoute.get("/user/:id", getUser)
userRoute.get("/user/suggested-users/:id", getSuggestedUser)

module.exports = { userRoute }