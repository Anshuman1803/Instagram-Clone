import React, { useEffect, useRef, useState } from "react";
import { MdOutlineSecurity } from "react-icons/md";
import microSoft from "../Assets/Microsoft.png";
import playStore from "../Assets/Play-Store.png";
import { useLocation, Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "../utility/customAxios"
import ButtonLoader from "./ButtonLoader";

export function OTP() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { Type } = useParams();
  const firstInputRef = useRef();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    firstInputRef.current.focus();
  }, []);

  const handleOTPChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value) || value.includes(" ")) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && e.target.nextSibling) {
      e.target.nextSibling.focus();
    }
  };

  const handleOTPkeydown = (e, index) => {
    if (e.keyCode === 8 && !otp[index] && index > 0) {
      e.preventDefault();
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      e.target.previousSibling.focus();
    }
  };

  const handleClearOTPinput = (e) => {
    e.preventDefault();
    firstInputRef.current.focus();
    setOtp(new Array(6).fill(""));
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setButtonLoading(true);
    try {
      const response = await axios.post(
        "/verify-OTP",
        {
          OTP: Number(otp.join("")),
          userEmail: state?.userEmail,
        }
      );

      if (response.data.success) {
        if (Type === "Account-verification-forgot-password") {
          navigate("/user/auth/password/reset-password");
          toast.success("Now, Reset your password");
        } else {
          const registerResponse = await axios.post(
            "/auth/user/register",
            {
              userName: state?.userName,
              fullName: state?.fullName,
              userEmail: state?.userEmail,
              userPassword: state?.userPassword,
            }
          );

          if (registerResponse.data.resMsg === "User Registred Successfully") {
            toast.success("User Registered Successfully");
            setOtp(new Array(6).fill(""));
            navigate("/user/auth/signin");
          } else {
            toast.error("Try Again");
          }
        }
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      toast.error(`Server error: ${error.message}`);
    } finally {
      setOtp(new Array(6).fill(""));
      setButtonLoading(false);
    }
  };

  return (
    <div className="Auth__UserLoginFormContainer">
      <form className="otpVerifier__Form">
        <h3 className="otpVerifier__Form_heading">
          <MdOutlineSecurity className="otpVerifier__Form_heading_ICON" />
        </h3>
        <h4 className="otpVerifier__Form_Secondaryheading">
          Enter the one-time password sent to
          <span className="otpVerifier__mailSentTo">{state?.userEmail}</span>
        </h4>

        <div className="OTPForm__inputboxContainer">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              className="OTPForm__input"
              value={data}
              onChange={(e) => handleOTPChange(e, index)}
              onKeyDown={(e) => handleOTPkeydown(e, index)}
              onFocus={(e) => e.target.select()}
              ref={index === 0 ? firstInputRef : null}
              readOnly={buttonLoading}
            />
          ))}
        </div>

        <div className="OTP_Form_ButtonContainer">
          <button
            className="OTP__buttons OTPForm__clearButton"
            onClick={handleClearOTPinput}
          >
            Clear
          </button>

          <button
            className="OTP__buttons OTPForm__verifyButton"
            onClick={handleVerifyOTP}
          >
            {buttonLoading ? <ButtonLoader /> : "Verify"}
          </button>
        </div>
      </form>

      <div className="Get_App_Container">
        <h4 className="Get_App_Container-Title">Get the app.</h4>
        <div className="platformButton__container">
          <Link
            to="https://play.google.com/store/apps/details?id=com.instagram.android&referrer=ig_mid%3D0C826C21-17C3-444A-ABB7-EBABD37214D7%26utm_campaign%3DloginPage%26utm_content%3Dlo%26utm_source%3Dinstagramweb%26utm_medium%3Dbadge"
            target="_blank"
          >
            <img
              src={playStore}
              alt="Download-From-Play-Store"
              className="platformButtonImages"
            />
          </Link>

          <Link
            to="https://www.microsoft.com/store/productId/9NBLGGH5L9XT?ocid=pdpshare"
            target="_blank"
          >
            <img
              src={microSoft}
              alt="Download-From-Microsoft"
              className="platformButtonImages"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
