const { userSignIn, userRegister, getUser, otpSender} = require("../controller/user.controller");
const userRoute = require("express").Router();


userRoute.post("/user/verify-account", otpSender)
userRoute.post("/user/register", userRegister);
userRoute.post("/user/signin", userSignIn);
userRoute.get("/user/:id", getUser)

module.exports = {userRoute}