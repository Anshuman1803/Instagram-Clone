import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UserLoggedOut } from "../Redux/ReduxSlice";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export function usePostComment(commentCounter) {
  const { instaUserID, instaTOKEN } = useSelector((state) => state.Instagram);
  const dispatch = useDispatch();
  const navigateTO = useNavigate();
  const headers = { Authorization: `Bearer ${instaTOKEN}` };
  const [newComment, setNewComment] = useState("");
  const [tempCommentsCounter, setTempCommentsCounter] = useState(commentCounter);

  const handlePostComment = (e, posts) => {
    e.preventDefault();

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
        } else {
          toast.error(response.data.msg);
          setNewComment("");
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
        setNewComment("");
      });
  };

  return { tempCommentsCounter, handlePostComment, newComment, setNewComment };
}
