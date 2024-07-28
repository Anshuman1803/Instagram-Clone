import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UserLoggedOut, userRemoveSavePost } from "../Redux/ReduxSlice";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export function useRemoveSavePost() {
    const { instaUserID, instaTOKEN } = useSelector((state) => state.Instagram);
    const dispatch = useDispatch();
    const navigateTO = useNavigate();
    const headers = { Authorization: `Bearer ${instaTOKEN}` };

    const handleRemoveSavePost = (e, postID) => {
        e.preventDefault();
        axios
          .patch(`${BACKEND_URL}posts/delete/save-post/${postID}`, { instaUserID }, { headers })
          .then((response) => {
            if (response.data.success) {
              toast.success(response.data.msg);
              dispatch(userRemoveSavePost(postID));
            } else {
              toast.error(response.data.msg);
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
    
  return {handleRemoveSavePost}
}
