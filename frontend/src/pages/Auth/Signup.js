import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import instaLOGO from "../../Assets/Logo.png";
import googleLOGO from "../../Assets/googleLOGO.png";
import playStore from "../../Assets/Play-Store.png";
import microSoft from "../../Assets/Microsoft.png";
import toast from "react-hot-toast";
import axios from "axios";
import ButtonLoader from "../../components/ButtonLoader";
import authStyle from "./auth.module.css"
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function SignUp() {
  const navigateTO = useNavigate();
  const userEmailRef = useRef();
  const fullNameref = useRef();
  const userNameref = useRef();
  const userPasswordref = useRef();
  const [btnLoader, setBtnLoader] = useState(false);
  const [errorState, setErrorState] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [userDetails, setUserDetails] = useState({
    userEmail: "",
    fullName: "",
    userName: "",
    userPassword: "",
  });

  const togglePasswordShow = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const clearFields = () => {
    setErrorState({});
    setUserDetails({
      userEmail: "",
      fullName: "",
      userName: "",
      userPassword: "",
    });
  };


  const handleInputOnChange = (e) => {
    setErrorState({});
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value.trim() });
  };

  const handleSignUPClick = (e) => {
    e.preventDefault();

    if (!userDetails.userEmail.includes("@gmail.com")) {
      setErrorState({
        userEmailError: true,
      });
      toast.error("Invalid email address");
      userEmailRef.current.focus();
    } else if (
      !(userDetails.fullName.length > 3 || userDetails.fullName < 20)
    ) {
      setErrorState({
        fullNameError: true,
      });
      toast.error("Invalid name");
      fullNameref.current.focus();
    } else if (userDetails.userName.length < 6) {
      setErrorState({
        userNameError: true,
      });
      toast.error("Username at least 6 characters long");
      userNameref.current.focus();
    } else if (userDetails.userPassword.length < 8) {
      setErrorState({
        userPasswordError: true,
      });
      toast.error("Password at least 8 character long");
      userPasswordref.current.focus();
    } else {
      setBtnLoader(true);
      axios
        .post(
          `${BACKEND_URL}auth/user/verify-account`,
          userDetails
        )
        .then((response) => {
          if (response.data.success) {
            toast.success(`${response.data.msg}`);
            setBtnLoader(false);
            navigateTO(`/user/auth/OTP/Email-verification`, { state: userDetails })
            setUserDetails({ ...userDetails, sendOTP: response.data.sendOTP });
          } else if (response.data.msg === "username already taken") {
            toast.error(`${response.data.msg}`);
            setBtnLoader(false);
            userNameref.current.focus();
          } else {
            toast.error(`${response.data.msg}`);
            userEmailRef.current.focus();
            setBtnLoader(false);
            clearFields();
          }
        })
        .catch((err) => {
          toast.error(`Something went wrong! ${err.message}`);
          userEmailRef.current.focus();
          setBtnLoader(false);
        });
    }
  };

  const handleContinueWithGoogle = (e) => {
    e.preventDefault();
    try {
      const googleSignupUrl = `${BACKEND_URL}/auth/google?userType=${userDetails.role}`;
      window.location.href = googleSignupUrl;
    } catch (error) {
      console.error("Google signup error:", error);
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
              name="userEmail"
              className={`${authStyle.Auth__formItem} ${errorState.userEmailError && `${authStyle.Auth__formItemErrorItemBox__errorState}`
                }`}
              placeholder="Email address"
              onChange={handleInputOnChange}
              value={userDetails.userEmail}
              ref={userEmailRef}
              autoFocus
              autoComplete="current-userID"
            />
          </div>

          <div className={`${authStyle.Auth__formItemBox}`}>
            <input
              type="text"
              name="fullName"
              className={`${authStyle.Auth__formItem} ${errorState.fullNameError && `${authStyle.Auth__formItemErrorItemBox__errorState}`
                }`}
              placeholder="Name"
              onChange={handleInputOnChange}
              value={userDetails.fullName}
              ref={fullNameref}
              autoComplete="off"
              maxLength={20}
              minLength={3}
              autoCapitalize="on"
            />
          </div>

          <div className={`${authStyle.Auth__formItemBox}`}>
            <input
              type="text"
              name="userName"
              className={`${authStyle.Auth__formItem} ${errorState.userNameError && `${authStyle.Auth__formItemErrorItemBox__errorState}`
                }`}
              placeholder="Username"
              onChange={handleInputOnChange}
              value={userDetails.userName}
              ref={userNameref}
              autoComplete="current-userName"
              maxLength={15}
            />
          </div>

          <div className={`${authStyle.Auth__formItemBox}`}>
            <input
              type={showPassword ? "text" : "password"}
              name="userPassword"
              className={`${authStyle.Auth__formItem} ${errorState.userPasswordError && `${authStyle.Auth__formItemErrorItemBox__errorState}`
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
            className={`${authStyle.Auth__formButton} ${(userDetails.userEmail &&
              userDetails.userPassword &&
              userDetails.fullName &&
              userDetails.userName) ||
              `${authStyle.unActiveFormButton}`
              }`}
            onClick={handleSignUPClick}
          >
            {btnLoader ? <ButtonLoader /> : "Sign up"}
          </button>

          <div className={`${authStyle.authForm__hrContainer}`}>
            <p className={`${authStyle.authForm__hrContainer_line}`}></p>
            <span className={`${authStyle.authForm__hrContainerOR_text}`}>OR</span>
          </div>

          <Link onClick={handleContinueWithGoogle} className={`${authStyle.authForm__googleLoginLINK} ${btnLoader && 'Unactive'}`}>
            <img
              src={googleLOGO}
              alt="googleLOGO"
              className={`${authStyle.googleLoginLOGO}`}
            />
            <span className={`${authStyle.authForm__googleLoginText}`}>
            Continue with google
            </span>
          </Link>
        </form>
      </div>

      <div className={`${authStyle.authGotoSignUP_container}`}>
        Have an account?
        <Link className={`${authStyle.gotoRegisterPageLINK} ${btnLoader && 'Unactive'}`} to={"/user/auth/signin"}>
          Log in
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

export default SignUp;
