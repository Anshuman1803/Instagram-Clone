import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import instaLOGO from "../../Assets/Logo.png";
import googleLOGO from "../../Assets/googleLOGO.png";
import playStore from "../../Assets/Play-Store.png";
import microSoft from "../../Assets/Microsoft.png";
function Login() {
  const navigateTO = useNavigate()
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

  return (
    <div className="Auth__UserLoginFormContainer">
      <div className="authFormn_Box">
        <Link to={"/"} className="LoginForm__Link__Logo">
          <img
            src={instaLOGO}
            alt="instagramLOGO"
            className="LoginForm__LOGO"
          />
        </Link>

        <form className="Auth__LoginForm">
          <div className="Auth__formItemBox">
            <input
              type="text"
              name="userID"
              className={`Auth__formItem ${
                errorState.userIDError && "ItemBox__errorState"
              }`}
              placeholder="Username, or email"
              onChange={handleInputOnChange}
              value={userDetails.userID}
              autoFocus
              ref={userIDref}
              autoComplete="current-userID"
            />
          </div>

          <div className="Auth__formItemBox">
            <input
              type={showPassword ? "text" : "password"}
              name="userPassword"
              className={`Auth__formItem ${
                errorState.userPasswordError && "ItemBox__errorState"
              }`}
              placeholder="Password"
              onChange={handleInputOnChange}
              value={userDetails.userPassword}
              ref={userPasswordref}
              autoComplete="current-password"
            />
            {userDetails.userPassword && (
              <span
                className="formPassword__showHide"
                onClick={togglePasswordShow}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            )}
          </div>

          <button
            type="button"
            className={`Auth__formButton ${
              (userDetails.userID && userDetails.userPassword) ||
              "unActiveFormButton"
            }`}
          >
            Log in
          </button>

          <div className="authForm__hrContainer">
            <p className="authForm__hrContainer_line"></p>
            <span className="authForm__hrContainerOR_text">OR</span>
          </div>

          <Link className="authForm__googleLoginLINK">
            <img
              src={googleLOGO}
              alt="googleLOGO"
              className="googleLoginLOGO"
            />
            <span className="authForm__googleLoginText">
              Log in with google
            </span>
          </Link>
          <p className="authForm__forgotPasswordText" onClick={()=> navigateTO("/user/auth/password/forgot-password")}>Forgot password?</p>
        </form>
      </div>

      <div className="authGotoSignUP_container">
        Don't have an account?{" "}
        <Link className="gotoRegisterPageLINK" to={"/user/auth/register"}>
          Sign up
        </Link>
      </div>

      <div className="Get_App_Container">
        <h4 className="Get_App_Container-Title">Get the app.</h4>
        <div className="platformButton__container">
          <Link
            to={
              "https://play.google.com/store/apps/details?id=com.instagram.android&referrer=ig_mid%3D0C826C21-17C3-444A-ABB7-EBABD37214D7%26utm_campaign%3DloginPage%26utm_content%3Dlo%26utm_source%3Dinstagramweb%26utm_medium%3Dbadge"
            }
            target="_blank"
          >
            <img
              src={playStore}
              alt="Download-From-Play-Store"
              className="platformButtonImages"
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
              className="platformButtonImages"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
