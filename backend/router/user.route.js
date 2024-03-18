const { userSignIn, userRegister, getUser, otpSender, forgotPassword, resetPassword} = require("../controller/user.controller");
const userRoute = require("express").Router();


userRoute.post("/user/verify-account", otpSender)
userRoute.post("/user/register", userRegister);
userRoute.post("/user/signin", userSignIn);
userRoute.post("/user/password/forgot-password", forgotPassword);
userRoute.post("/user/password/reset-password", resetPassword);
userRoute.get("/user/:id", getUser)

module.exports = {userRoute}