const { createPost, getPost,getAllPosts, savePost,getSavePost} = require("../controller/post.controller");
const { upload } = require("../middleware/uploadImage");
const postRoute = require("express").Router();



postRoute.post("/create-post", upload.single('postPoster'), createPost);
postRoute.patch("/save-post/:postID", savePost)
postRoute.get("/get-save-post/:instaUserID", getSavePost)
postRoute.get("/post/:userID", getPost)
postRoute.get("/get-all/:userID", getAllPosts)

module.exports = {postRoute}