import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userFollow, UserLoggedOut } from "../Redux/ReduxSlice";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export function useUserFollow(setButtonLoading) {
  const { instaTOKEN, instaUserID } = useSelector((state) => state.Instagram);
  const headers = { Authorization: `Bearer ${instaTOKEN}` };
  const dispatch = useDispatch();
  const navigateTO = useNavigate();

  const handleFollowButtonClick = (e, userID) => {
    e.preventDefault();
    if (typeof setButtonLoading === "function") {
      setButtonLoading(true);
    }
    axios
      .patch(`${BACKEND_URL}users/add-to-following-list/${instaUserID}`, { followingUserID: userID }, { headers })
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.msg);
          dispatch(userFollow(userID));
          if (typeof setButtonLoading === "function") {
            setButtonLoading(false);
          }
        } else {
          toast.error(response.data.msg);
          if (typeof setButtonLoading === "function") {
            setButtonLoading(false);
          }
        }
      })
      .catch((error) => {
        if (typeof setButtonLoading === "function") {
          setButtonLoading(false);
        }
        if (error.response.status === 401) {
          dispatch(UserLoggedOut());
          navigateTO("/user/auth/signin");
          toast.error("Your session has expired. Please login again.");
        } else if (error.response.status === 500) {
          toast.error("Internal Server Error. Please try again later.");
        } else {
          toast.error("Failed to load");
        }
      });
  };
  return { handleFollowButtonClick };
}
