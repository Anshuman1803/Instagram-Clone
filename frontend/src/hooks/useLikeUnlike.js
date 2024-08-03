import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UserLoggedOut, userLikeUnlikePost } from "../Redux/ReduxSlice";
import socket from "../utility/socket";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const useLikeUnlike = (likeCounter) => {
  const { instaUserID, instaTOKEN } = useSelector((state) => state.Instagram);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const headers = { Authorization: `Bearer ${instaTOKEN}` };
  const [buttonLoading, setButtonLoading] = useState(false);
  const [tempLikeCounter, setTempLikeCounter] = useState(likeCounter);

  const handleLikePostClick = async (e, postID, owner) => {
    e.preventDefault();
    setButtonLoading(true);
    try {
      const response = await axios.patch(`${BACKEND_URL}posts/like-post/${instaUserID}`, { postID }, { headers });
      if (response.data.success) {
        setButtonLoading(false);
        setTempLikeCounter((prevState) => prevState + 1);
        dispatch(userLikeUnlikePost({ type: "like", postID }));

        // send notification tempObj
        const tempNotificationObj = {
          owner: owner,
          postID: postID,
          userID: instaUserID,
          notificationText: `liked your post`,
          notificationStatus: "unread",
          notificationType: "like",
          createdAt: Date.now(),
        };

        // send the notification to the server
        socket.emit("sendNotificationFromUser", tempNotificationObj);
        axios.post(`${BACKEND_URL}notifications/create/new-notification`, tempNotificationObj, { headers });

      } else {
        setButtonLoading(false);
        toast(`${response.data.msg}`, { icon: "ⓘ" });
      }
    } catch (error) {
      setButtonLoading(false);
      if (error.response?.status === 401) {
        dispatch(UserLoggedOut());
        navigate("/user/auth/signin");
        toast.error("Your session has expired. Please login again.");
      } else {
        toast.error(`Server error: ${error.message}`);
      }
    }
  };

  const handleUnLikePostClick = (e, postID) => {
    e.preventDefault();
    setButtonLoading(true);
    axios
      .patch(`${BACKEND_URL}posts/unlike-post/${instaUserID}`, { postID }, { headers })
      .then((response) => {
        if (response.data.success) {
          setButtonLoading(false);
          setTempLikeCounter((prevState) => prevState - 1);
          dispatch(
            userLikeUnlikePost({
              type: "unlike",
              postID: postID,
            })
          );
        } else {
          setButtonLoading(false);
          toast.error(response.data.msg);
        }
      })
      .catch((error) => {
        setButtonLoading(false);
        if (error.response.status === 401) {
          dispatch(UserLoggedOut());
          navigate("/user/auth/signin");
          toast.error("Your session has expired. Please login again.");
        } else {
          toast.error(`Server error: ${error.message}`);
        }
      });
  };

  return { handleLikePostClick, handleUnLikePostClick, buttonLoading, tempLikeCounter };
};
