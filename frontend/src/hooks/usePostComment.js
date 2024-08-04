import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UserLoggedOut } from "../Redux/ReduxSlice";
import socket from "../utility/socket";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export function usePostComment(commentCounter, loadComments) {
  const { instaUserID, instaTOKEN } = useSelector((state) => state.Instagram);
  const dispatch = useDispatch();
  const navigateTO = useNavigate();
  const headers = { Authorization: `Bearer ${instaTOKEN}` };
  const [newComment, setNewComment] = useState("");
  const [tempCommentsCounter, setTempCommentsCounter] = useState(commentCounter);
  const [postCommentLoading, setcommentLoader] = useState(false);

  const handlePostComment = (e, posts) => {
    e.preventDefault();
    setcommentLoader(true);
    const tempNewComments = {
      postID: posts?._id,
      commentText: newComment,
      userID: instaUserID,
    };

    axios
      .post(`${BACKEND_URL}comments/create-new-comments`, tempNewComments, {
        headers,
      })
      .then((response) => {
        if (response.data.success) {
          setTempCommentsCounter((prevState) => prevState + 1);
          toast.success(response.data.msg);
          setNewComment("");
          setcommentLoader(false);
          if (typeof loadComments === "function") {
            loadComments();
          }
          // send notification tempObj
          const tempNotificationObj = {
            owner: posts?.user,
            postID: posts?._id,
            userID: instaUserID,
            notificationText: `commented on your post`,
            notificationStatus: "unread",
            notificationType: "comment",
            createdAt: Date.now(),
          };
          // send the notification to the server
          socket.emit("sendNotificationFromUser", tempNotificationObj);
          axios.post(`${BACKEND_URL}notifications/create/new-notification`, tempNotificationObj, { headers });
        } else {
          toast.error(response.data.msg);
          setNewComment("");
          setcommentLoader(false);
          if (typeof loadComments === "function") {
            loadComments();
          }
        }
      })
      .catch((error) => {
        setcommentLoader(false);
        if (error.response.status === 401) {
          dispatch(UserLoggedOut());
          navigateTO("/user/auth/signin");
          toast.error("Your session has expired. Please login again.");
        } else {
          toast.error(`Server error: ${error.message}`);
        }
        setNewComment("");
      });
  };

  const handleDeleteComment = (e, commentId) => {
    e.preventDefault();
    axios
      .delete(`${BACKEND_URL}comments/delete-comment/${commentId}`, { headers })
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.msg);
          loadComments();
        } else {
          toast.error(response.data.msg);
          loadComments();
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          dispatch(UserLoggedOut());
          navigateTO("/user/auth/signin");
          toast.error("Your session has expired. Please login again.");
        } else {
          toast.error(`Server error: ${error.message}`);
        }
      });
  };

  return { tempCommentsCounter, handlePostComment, handleDeleteComment, newComment, setNewComment, postCommentLoading };
}
