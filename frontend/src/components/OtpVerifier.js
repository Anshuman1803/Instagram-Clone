import axios from "axios";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ComponentLoader from "./ComponentLoader";

function OtpVerifier({ type, title, userDetails, cbFun }) {
  const otpInputRef = useRef();
  const navigateTO = useNavigate();
  const [btnLoader, setBtnLoader] = useState(false);
  const [otp, setOtp] = useState("");

  const handleInputOnChange = (e) => {
    if (!isNaN(e.target.value)) {
      setOtp(e.target.value.trim());
    }
  };

  const handleVerifyOTPClick = (e) => {
    e.preventDefault();
    if (Number(otp) === Number(userDetails.sendOTP)) {
      setBtnLoader(true);
      if (type === "EmailVerificationOTP") {
        axios
          .post("https://instagram-clone-bsmc.onrender.com/api/v1/auth/user/register", userDetails)
          .then((response) => {
            if (response.data.resMsg === "User Registred Successfully") {
              toast.success("User Registred Successfully");
              navigateTO("/user/auth/signin");
              setOtp("");
              setBtnLoader(false);
            } else {
              toast.error("Try Again");
              setBtnLoader(false);
              navigateTO("/user/auth/register");
            }
          })
          .catch((err) => {
            toast.error(`Something went wrong! ${err.message}`);
            navigateTO("/user/auth/register");
            setBtnLoader(false);
          });
      } else if (type === "PasswordReseterOTP") {
        navigateTO("/user/auth/password/reset-password", {"state" : userDetails.userEmail});
        toast.success("Now! Reset your password");
      }
    } else {
      toast.error("Invalid OTP");
      otpInputRef.current.focus();
      setOtp("");
    }
  };

  return (
    <div className="otpVerifier__Container">
      <form className="otpVerifier__form">
        <h1 className="optVerifierForm__title">{title}</h1>
        <input
          type="text"
          name="otp"
          className="otpVerifier__inputBox"
          autoCapitalize="off"
          maxLength={6}
          autoFocus
          value={otp}
          onChange={handleInputOnChange}
          ref={otpInputRef}
        />
        <div className="otpVerifier__buttonContainer">
          <button className="otpVerifier__button" type="button" onClick={cbFun}>
            Cancle
          </button>
          <button
            className="otpVerifier__button"
            onClick={handleVerifyOTPClick}
          >
            Veriry
          </button>
        </div>
        {btnLoader && <ComponentLoader />}
      </form>
    </div>
  );
}

export default OtpVerifier;
