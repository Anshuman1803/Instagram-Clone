import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserLoggedOut } from "../Redux/ReduxSlice";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export function usePostDelete() {
    const { instaTOKEN} = useSelector((state) => state.Instagram);
  const headers = { Authorization: `Bearer ${instaTOKEN}` };
  const dispatch = useDispatch();
  const navigateTO = useNavigate();


    const handleDeletePost = (e, postID, userID,CbClosePopup) => {
        e.preventDefault();
        axios
          .delete(`${BACKEND_URL}posts/delete-post/${postID}`, { headers })
          .then((response) => {
            if (response.data.success) {
              toast.success(response.data.msg);
              CbClosePopup();
              navigateTO(`/${userID}`);
            } else {
              toast.error(response.data.msg);
              CbClosePopup();
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
  return {handleDeletePost}
}