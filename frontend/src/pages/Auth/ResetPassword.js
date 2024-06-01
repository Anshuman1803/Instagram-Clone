import React, { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import lockPNG from "../../Assets/lockPNG.png";
import playStore from "../../Assets/Play-Store.png";
import microSoft from "../../Assets/Microsoft.png";
import ButtonLoader from "../../components/ButtonLoader";
import ComponentLoader from "../../components/ComponentLoader";
import toast from "react-hot-toast";
import axios from "../../utility/customAxios"
function ResetPassword() {
  const userEmail = useLocation().state;
  const navigateTO = useNavigate();
  const [btnLoader, setBtnLoader] = useState(false);
  const newPasswordRef = useRef();
  const confirmPasswordRef = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const [userDetails, setUserDetails] = useState({
    userEmail: userEmail,
    newPassword: "",
    confirmPassword: "",
  });

  const [errorState, setErrorState] = useState({
    newPasswordError: false,
    confirmPasswordError: false,
    errMsg: "",
  });

  const togglePasswordShow = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleInputOnChange = (e) => {
    setErrorState({});
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value.trim() });
  };

  const handleResetPasswordClick = (e) => {
    e.preventDefault();
    setBtnLoader(true);
    if (userDetails.newPassword.length < 8) {
      setBtnLoader(false);
      setErrorState({
        userPasswordError: true,
      });
      toast.error("Password at least 8 character long");
      newPasswordRef.current.focus();
    } else if (userDetails.newPassword !== userDetails.confirmPassword) {
      setBtnLoader(false);
      toast.error("Password not matched");
      newPasswordRef.current.focus();
    } else {
      axios
        .post(
          "auth/user/password/reset-password",
          userDetails
        )
        .then((response) => {
          setBtnLoader(false);
          if (response.data.success) {
            toast.success("Password reset successfully");
            navigateTO("/user/auth/signin");
          } else {
            toast.error("Try again");
            navigateTO("/user/auth/password/forgot-password");
            setBtnLoader(false);
          }
        })
        .catch((error) => {
          toast.error(`Something went wrong ${error}`);
          navigateTO("/user/auth/password/forgot-password");
          setBtnLoader(false);
        });
    }
  };

  return (
    <div className="Auth__UserLoginFormContainer">
      <div className="authFormn_Box forgotPasswordauthBox">
        <img
          src={lockPNG}
          alt="Security_LOGO"
          className="authForm__securityLOGO"
        />
        <h1 className="authForm__ForgotPassHeading">Reset your password</h1>
        <h3 className="authForm__ForgotPassSubHeading">
          Enter your new password below. Make sure it's strong and includes
          mixed values.
        </h3>
        <form className="Auth__LoginForm">
          <div className="Auth__formItemBox">
            <input
              type={"text"}
              style={{ display: "none" }}
              autoComplete="off"
            />
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              className={`Auth__formItem ${errorState.newPasswordError && "ItemBox__errorState"
                }`}
              placeholder="New password"
              onChange={handleInputOnChange}
              value={userDetails.newPassword}
              autoFocus
              ref={newPasswordRef}
              autoComplete="current-newPassword"
              maxLength={15}
            />
            {userDetails.confirmPassword && (
              <span
                className="formPassword__showHide"
                onClick={togglePasswordShow}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            )}
          </div>

          <div className="Auth__formItemBox">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              className={`Auth__formItem ${errorState.confirmPasswordError && "ItemBox__errorState"
                }`}
              placeholder="Confirm password"
              onChange={handleInputOnChange}
              value={userDetails.confirmPassword}
              ref={confirmPasswordRef}
              autoComplete="current-password"
              maxLength={15}
            />
          </div>

          <button
            type="button"
            className={`Auth__formButton ${(userDetails.newPassword && userDetails.confirmPassword) ||
              "unActiveFormButton"
              }`}
            onClick={handleResetPasswordClick}
          >
            {btnLoader ? <ButtonLoader /> : "Reset Password"}
          </button>
        </form>
        <button
          className="backtoLogIN_button"
          onClick={() => navigateTO("/user/auth/signin")}
        >
          Back to login
        </button>
        {btnLoader && <ComponentLoader />}
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

export default ResetPassword;
