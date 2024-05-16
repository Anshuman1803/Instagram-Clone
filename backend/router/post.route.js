const { createPost, getPost } = require("../controller/post.controller");
const { upload } = require("../middleware/uploadImage");
const postRoute = require("express").Router();



postRoute.post("/create-post", upload.single('postPoster'), createPost);
postRoute.get("/post/:userID", getPost)

module.exports = {postRoute}