const commentsRoute = require("express").Router();
const {createNewComment, getComments, deleteComment} = require("../controller/comment.controller")
commentsRoute.post("/create-new-comments", createNewComment);
commentsRoute.get("/get-all-comments/:postId", getComments);
commentsRoute.delete("/delete-comment/:commentId", deleteComment);

module.exports = { commentsRoute };