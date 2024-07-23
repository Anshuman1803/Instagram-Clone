import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { UserLoggedIn } from "../../Redux/ReduxSlice";

const GoogleCallback = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const userID = urlParams.get("userID");
    const Token = urlParams.get("Token");
    const userName = urlParams.get("userName");
    const userProfile = urlParams.get("userProfile");
    const userFullName = urlParams.get("userFullName");
    let savedPost = urlParams.get("savedPost") ? urlParams.get("savedPost") : [];
    let userFollwing = urlParams.get("userFollwing") ? urlParams.get("userFollwing") : [];
    let userFollowers = urlParams.get("userFollowers") ? urlParams.get("userFollowers") : [];
    let likedPost = urlParams.get("likedPost") ? urlParams.get("likedPost") : [];
    if (
      userID &&
      Token &&
      userName &&
      userProfile &&
      userFullName &&
      savedPost &&
      userFollwing &&
      userFollowers &&
      likedPost
    ) {
      dispatch(
        UserLoggedIn({
          userID,
          Token,
          userName,
          userProfile,
          userFullName,
          savedPost,
          userFollwing,
          userFollowers,
          likedPost,
        })
      );
      navigate("/");
    }
  }, [dispatch, location.search, navigate]);

  return <></>;
};

export default GoogleCallback;
