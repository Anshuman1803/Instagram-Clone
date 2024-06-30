import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import instaLOGO from "../../Assets/Logo.png";
import googleLOGO from "../../Assets/googleLOGO.png";
import playStore from "../../Assets/Play-Store.png";
import microSoft from "../../Assets/Microsoft.png";
import ButtonLoader from "../../components/ButtonLoader";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { UserLoggedIn } from "../../Redux/ReduxSlice";
import authStyle from "./auth.module.css"
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Login() {
  const dispatch = useDispatch();
  const navigateTO = useNavigate();
  const [btnLoader, setBtnLoader] = useState(false);
  const userIDref = useRef();
  const userPasswordref = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const [userDetails, setUserDetails] = useState({
    userID: "",
    userPassword: "",
  });

  const [errorState, setErrorState] = useState({
    userIDError: false,
    userPasswordError: false,
    errMsg: "",
  });

  const togglePasswordShow = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleInputOnChange = (e) => {
    setErrorState({});
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleSignINClick = (e) => {
    e.preventDefault();
    setBtnLoader(true);

    if (userDetails.userID.length < 6) {
      setBtnLoader(false);
      setErrorState({
        userIDError: true,
      });
      toast.error("Invalid user ID");
      userIDref.current.focus();
    } else if (userDetails.userPassword.length < 8) {
      setBtnLoader(false);
      setErrorState({
        userPasswordError: true,
      });
      toast.error("Invalid password");
      userPasswordref.current.focus();
    } else {
      axios
        .post(`${BACKEND_URL}auth/user/signin`, userDetails)
        .then((response) => {

          if (response.data.success) {
            setBtnLoader(false);
            navigateTO("/")
            toast.success("User logged in successfully");
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
          } else {
            setBtnLoader(false);
            toast.error(response.data.msg);
            userIDref.current.focus();
          }
        })
        .catch((err) => {
          setBtnLoader(false);
          toast.error(`${err.message}`);
          userIDref.current.focus();
        });
    }
  };

  return (
    <div className={`${authStyle.Auth__UserLoginFormContainer}`}>
      <div className={`${authStyle.authFormn_Box}`}>
        <Link to={"/"} className={`${authStyle.LoginForm__Link__Logo}`}>
          <img
            src={instaLOGO}
            alt="instagramLOGO"
            className={`${authStyle.LoginForm__LOGO}`}
          />
        </Link>

        <form className={`${authStyle.Auth__LoginForm}`}>
          <div className={`${authStyle.Auth__formItemBox}`}>
            <input
              type="text"
              name="userID"
              className={`${authStyle.Auth__formItem} ${errorState.userIDError && `${authStyle.ItemBox__errorState}`
                }`}
              placeholder="Username, or email"
              onChange={handleInputOnChange}
              value={userDetails.userID}
              autoFocus
              ref={userIDref}
              autoComplete="current-userID"
            />
          </div>

          <div className={`${authStyle.Auth__formItemBox}`}>
            <input
              type={showPassword ? "text" : "password"}
              name="userPassword"
              className={`${authStyle.Auth__formItem} ${errorState.userPasswordError && `${authStyle.ItemBox__errorState}`
                }`}
              placeholder="Password"
              onChange={handleInputOnChange}
              value={userDetails.userPassword}
              ref={userPasswordref}
              autoComplete="current-password"
              maxLength={15}
            />
            {userDetails.userPassword && (
              <span
                className={`${authStyle.formPassword__showHide}`}
                onClick={togglePasswordShow}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            )}
          </div>

          <button
            type="button"
            className={`${authStyle.Auth__formButton} ${(userDetails.userID && userDetails.userPassword) ||
              `${authStyle.unActiveFormButton}`
              }`}
            onClick={handleSignINClick}
          >
            {btnLoader ? <ButtonLoader /> : "Log in"}
          </button>

          <div className={`${authStyle.authForm__hrContainer}`}>
            <p className={`${authStyle.authForm__hrContainer_line}`}></p>
            <span className={`${authStyle.authForm__hrContainerOR_text}`}>OR</span>
          </div>

          <Link className={`${authStyle.authForm__googleLoginLINK} ${btnLoader && 'Unactive'}`}>
            <img
              src={googleLOGO}
              alt="googleLOGO"
              className={`${authStyle.googleLoginLOGO}`}
            />
            <span className={`${authStyle.authForm__googleLoginText}`}>
              Log in with google
            </span>
          </Link>
          <p
            className={`${authStyle.authForm__forgotPasswordText} ${btnLoader && 'Unactive'}`}
            onClick={() => navigateTO("/user/auth/password/forgot-password")}
          >
            Forgot password?
          </p>
        </form>
      </div>

      <div className={`${authStyle.authGotoSignUP_container}`}>
        Don't have an account?{" "}
        <Link className={`${authStyle.gotoRegisterPageLINK} ${btnLoader && 'Unactive'}`} to={"/user/auth/register"}>
          Sign up
        </Link>
      </div>

      <div className={`${authStyle.Get_App_Container}`}>
        <h4 className={`${authStyle.Get_App_Container_Title}`}>Get the app.</h4>
        <div className={`${authStyle.platformButton__container}`}>
          <Link
            to={
              "https://play.google.com/store/apps/details?id=com.instagram.android&referrer=ig_mid%3D0C826C21-17C3-444A-ABB7-EBABD37214D7%26utm_campaign%3DloginPage%26utm_content%3Dlo%26utm_source%3Dinstagramweb%26utm_medium%3Dbadge"
            }
            target="_blank"
          >
            <img
              src={playStore}
              alt="Download-From-Play-Store"
              className={`${authStyle.platformButtonImages}`}
            />
          </Link>

          <Link
            to={
              "https://www.microsoft.com/store/productId/9NBLGGH5L9XT?ocid=pdpshare"
            }
            target="_blank"
          >
            <img
              src={microSoft}
              alt="Download-From-Microsoft"
              id="Microsoft-Img-button"
              className={`${authStyle.platformButtonImages}`}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
