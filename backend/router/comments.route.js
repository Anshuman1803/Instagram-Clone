const commentsRoute = require("express").Router();
const { createNewComment, getComments, deleteComment } = require("../controller/comment.controller");
const { userAuthenticate } = require("../middleware/Authenticate");

commentsRoute.post("/create-new-comments", userAuthenticate, createNewComment);
commentsRoute.get("/get-all-comments/:postId", userAuthenticate, getComments);
commentsRoute.delete("/delete-comment/:commentId", userAuthenticate, deleteComment);

module.exports = { commentsRoute };