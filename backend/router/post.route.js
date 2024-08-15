const { createPost, getAllPosts, explorerPosts, savePost, deleteSavePostFromCollection, likePosts, unLikePosts, getLikedByUserList, deletePost, getPostDetails } = require("../controller/post.controller");
const { upload } = require("../middleware/uploadImage");
const { userAuthenticate } = require("../middleware/Authenticate")
const postRoute = require("express").Router();



postRoute.post("/create-post", userAuthenticate, upload.single('postPoster'), createPost);
postRoute.patch("/like-post/:currentUser", userAuthenticate, likePosts);
postRoute.patch("/unlike-post/:currentUser", userAuthenticate, unLikePosts);
postRoute.patch("/save-post/:postID", userAuthenticate, savePost);
postRoute.patch("/delete/save-post/:postID", userAuthenticate, deleteSavePostFromCollection);
postRoute.get("/get-all/:userID", userAuthenticate, getAllPosts);
postRoute.get("/get-explore-posts/:instaUserID", userAuthenticate, explorerPosts);
postRoute.get("/get-likedby-user-list/:postID", userAuthenticate, getLikedByUserList);
postRoute.get("/get-post-details/:postID", userAuthenticate, getPostDetails);
postRoute.delete("/delete-post/:postID", userAuthenticate, deletePost);

module.exports = { postRoute }