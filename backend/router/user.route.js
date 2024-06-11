const { userSignIn, userRegister, getUser,updateUserDetails, getSuggestedUser, otpSender, forgotPassword, resetPassword, authenticateUser } = require("../controller/user.controller");
const userRoute = require("express").Router();
const { upload } = require("../middleware/uploadImage");

userRoute.post("/verify/token", authenticateUser)
userRoute.post("/user/verify-account", otpSender)
userRoute.post("/user/register", userRegister);
userRoute.post("/user/signin", userSignIn);
userRoute.post("/user/password/forgot-password", forgotPassword);
userRoute.post("/user/password/reset-password", resetPassword);
userRoute.patch("/user/update-user-details/:userID", updateUserDetails);
userRoute.get("/user/:id", getUser)
userRoute.get("/user/suggested-users/:id", getSuggestedUser)

module.exports = { userRoute }