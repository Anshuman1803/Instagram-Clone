const { getUser, updateUserDetails, removeProfilePicture, getSuggestedUser,getUpdateduserDetails, verifyUserPassword, deleteUserAccount, searchUser, addUsersToFollowingList, unfollowUser } = require("../controller/user.controller");
const userRoute = require("express").Router();
const { upload } = require("../middleware/uploadImage");
const { userAuthenticate } = require("../middleware/Authenticate")


userRoute.post("/verify-user-password", userAuthenticate, verifyUserPassword);
userRoute.patch("/update-user-details/:userID", userAuthenticate, upload.single('profilePicture'), updateUserDetails);
userRoute.patch("/remove-profile-picture/:userID", userAuthenticate, removeProfilePicture);
userRoute.patch("/add-to-following-list/:userID", addUsersToFollowingList);
userRoute.patch("/unfollow/:userID", unfollowUser);
userRoute.get("/:id", getUser);
userRoute.get("/suggested-users/:id", getSuggestedUser);
userRoute.get("/get-user-updated-details/:currentUser", getUpdateduserDetails);
userRoute.post("/search-user", userAuthenticate, searchUser);
userRoute.delete("/delete-user-account", deleteUserAccount)

module.exports = { userRoute }