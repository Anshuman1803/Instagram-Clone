const { userSignIn, userRegister, getUser,updateUserDetails,removeProfilePicture, getSuggestedUser, otpSender, forgotPassword, resetPassword, authenticateUser,verifyUserPassword,deleteUserAccount } = require("../controller/user.controller");
const userRoute = require("express").Router();
const { upload } = require("../middleware/uploadImage");
const { userAuthenticate } = require("../middleware/Authenticate")

userRoute.post("/verify/token", authenticateUser)
userRoute.post("/user/verify-account", otpSender)
userRoute.post("/user/register", userRegister);
userRoute.post("/user/signin", userSignIn);
userRoute.post("/user/password/forgot-password", forgotPassword);
userRoute.post("/user/password/reset-password", resetPassword);
userRoute.post("/user/verify-user-password",userAuthenticate, verifyUserPassword);
userRoute.patch("/user/update-user-details/:userID", userAuthenticate, upload.single('profilePicture'), updateUserDetails);
userRoute.patch("/user/remove-profile-picture/:userID",userAuthenticate, removeProfilePicture);
userRoute.get("/user/:id", getUser)
userRoute.get("/user/suggested-users/:id", getSuggestedUser)
userRoute.delete("/user/delete-user-account", deleteUserAccount)

module.exports = { userRoute }