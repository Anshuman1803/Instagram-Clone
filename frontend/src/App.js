import { useEffect } from "react";
import "./App.css";
import AppRouter from "./router/AppRouter";
import { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { UserLoggedIn } from "./Redux/ReduxSlice";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
function App() {
  const { instaUserID} = useSelector((state) => state.Instagram);
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}users/get-user-updated-details/${instaUserID}`)
      .then((response) => {
        if (response.data.success) {
          dispatch(
            UserLoggedIn({
              userID: response.data.UserDetails._id,
              Token: response.data.TOKEN,
              userName: response.data.UserDetails.userName,
              userProfile: response.data.UserDetails.userProfile,
              userFullName: response.data.UserDetails.fullName,
              savedPost: response.data.UserDetails.savedPost,
              userFollwing: response.data.UserDetails.userFollowing,
              userFollowers: response.data.UserDetails.userFollowers,
              likedPost: response.data.UserDetails.likedPost,
            })
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <AppRouter />
    </>
  );
}

export default App;
