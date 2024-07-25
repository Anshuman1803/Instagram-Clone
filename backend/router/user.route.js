const { getUser, updateUserDetails, removeProfilePicture, getSuggestedUser,getUpdateduserDetails, verifyUserPassword, deleteUserAccount, searchUser, addUsersToFollowingList, unfollowUser,getFollowersList, getFollowingList, getAboutAccount } = require("../controller/user.controller");
const userRoute = require("express").Router();
const { upload } = require("../middleware/uploadImage");
const { userAuthenticate } = require("../middleware/Authenticate")


userRoute.post("/verify-user-password", userAuthenticate, verifyUserPassword);
userRoute.patch("/update-user-details/:userID", userAuthenticate, upload.single('profilePicture'), updateUserDetails);
userRoute.patch("/remove-profile-picture/:userID", userAuthenticate, removeProfilePicture);
userRoute.patch("/add-to-following-list/:userID", userAuthenticate,addUsersToFollowingList);
userRoute.patch("/unfollow/:userID",userAuthenticate, unfollowUser);
userRoute.get("/:id",userAuthenticate, getUser);
userRoute.get("/suggested-users/:id", getSuggestedUser);
userRoute.get("/get-user-updated-details/:currentUser", getUpdateduserDetails);
userRoute.get("/get-followers-userlist/:currentUser",userAuthenticate, getFollowersList);
userRoute.get("/get-following-userlist/:currentUser",userAuthenticate, getFollowingList);
userRoute.get("/about-account/:userID",userAuthenticate, getAboutAccount);
userRoute.post("/search-user", userAuthenticate, searchUser);
userRoute.delete("/delete-user-account",userAuthenticate, deleteUserAccount);


module.exports = { userRoute }