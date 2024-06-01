import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import lockPNG from "../../Assets/lockPNG.png";
import playStore from "../../Assets/Play-Store.png";
import microSoft from "../../Assets/Microsoft.png";
import ButtonLoader from "../../components/ButtonLoader";
import toast from "react-hot-toast";
import axios from "../../utility/customAxios"
function ForgotPassword() {
  const [btnLoader, setBtnLoader] = useState(false);
  const navigateTO = useNavigate();
  const userEmailref = useRef();

  const [userDetails, setUserDetails] = useState({
    userEmail: "",
  });

  const [errorState, setErrorState] = useState({
    userEmailError: false,
    userPasswordError: false,
    errMsg: "",
  });

  const handleInputOnChange = (e) => {
    setErrorState({});
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleGetOtpClick = (e) => {
    e.preventDefault();
    if (!userDetails.userEmail.includes("@gmail.com")) {
      setErrorState({
        userEmailError: true,
      });
      toast.error("Invalid email address");
      userEmailref.current.focus();
    } else {
      setBtnLoader(true);
      axios
        .post(
          "/auth/user/password/forgot-password",
          userDetails
        )
        .then((response) => {
          if (response.data.success) {
            toast.success(`${response.data.msg}`);
            navigateTO(`/user/auth/OTP/Account-verification-forgot-password`, { state: { userEmail: userDetails.userEmail } })
            setBtnLoader(false);
          } else {
            toast.error(`${response.data.msg}`);
            setBtnLoader(false);
            userEmailref.current.focus();
          }
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
        <h1 className="authForm__ForgotPassHeading">Trouble loggin in?</h1>
        <h3 className="authForm__ForgotPassSubHeading">
          Enter your email address and we'll send you an OTP to reset your
          password.
        </h3>

        <form className="Auth__LoginForm">
          <div className="Auth__formItemBox">
            <input
              type="text"
              name="userEmail"
              className={`Auth__formItem ${errorState.userEmailError && "ItemBox__errorState"
                }`}
              placeholder="Registered email address"
              onChange={handleInputOnChange}
              value={userDetails.userEmail}
              autoFocus
              ref={userEmailref}
              autoComplete="current-userEmail"
            />
          </div>

          <button
            type="button"
            className={`Auth__formButton getOTP_button ${!userDetails.userEmail && "unActiveFormButton"
              }`}
            onClick={handleGetOtpClick}
          >
            {btnLoader ? <ButtonLoader /> : "Get OTP"}
          </button>

          <div className="authForm__hrContainer">
            <p className="authForm__hrContainer_line"></p>
            <span className="authForm__hrContainerOR_text">OR</span>
          </div>

          <Link to="/user/auth/register" className={`createNewAccountLInk ${btnLoader && 'Unactive'}`}>
            Create new account
          </Link>
        </form>

        <button
          className={`backtoLogIN_button  ${btnLoader && 'Unactive'}`}
          onClick={() => navigateTO("/user/auth/signin")}
        >
          Back to login
        </button>
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

export default ForgotPassword;
