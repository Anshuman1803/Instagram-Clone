const { createPost, getPost, getAllPosts, savePost,deleteSavePostFromCollection, getSavePost } = require("../controller/post.controller");
const { upload } = require("../middleware/uploadImage");
const { userAuthenticate } = require("../middleware/Authenticate")
const postRoute = require("express").Router();



postRoute.post("/create-post", userAuthenticate, upload.single('postPoster'), createPost);
postRoute.patch("/save-post/:postID", userAuthenticate, savePost);
postRoute.patch("/delete/save-post/:postID", userAuthenticate, deleteSavePostFromCollection);
postRoute.get("/get-save-post/:instaUserID", userAuthenticate, getSavePost);
postRoute.get("/post/:userID", userAuthenticate, getPost);
postRoute.get("/get-all/:userID", userAuthenticate, getAllPosts);

module.exports = { postRoute }