import React, { useEffect, useRef, useState } from "react";
import { MdOutlineSecurity } from "react-icons/md";
import microSoft from "../Assets/Microsoft.png";
import playStore from "../Assets/Play-Store.png";
import { useLocation, Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from 'axios'
export function OTP() {
    const navigateTO= useNavigate();
    useParams();
    const { state } = useLocation();
    const { Type } = useParams();
    const firstInputRef = useRef();
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [buttonLoading, setButtonLoading] = useState(false);

    const handleOTPChange = (e, index) => {
        if (isNaN(e.target.value) || e.target.value.includes(" ")) return;
        setOtp([...otp.map((data, i) => (i === index ? e.target.value : data))]);

        if (e.target.nextSibling) {
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


    // const handleVerifyOTPClick = (e) => {
    //     e.preventDefault();
    //     if (Number(otp) === Number(userDetails.sendOTP)) {
    //         setButtonLoading(true);
    //         if ("type" === "EmailVerificationOTP") {
    //             axios
    //                 .post("http://localhost:5000/api/v1/auth/user/register", {
    //                     userName: state?.userName,
    //                     fullName: state?.fullName,
    //                     userEmail: state?.userEmail,
    //                     userPassword: state?.userPassword
    //                 })
    //                 .then((response) => {
    //                     if (response.data.resMsg === "User Registred Successfully") {
    //                         toast.success("User Registred Successfully");
    //                         navigateTO("/user/auth/signin");
    //                         setOtp("");
    //                         setButtonLoading(false);
    //                     } else {
    //                         toast.error("Try Again");
    //                         setButtonLoading(false);
    //                         navigateTO("/user/auth/register");
    //                     }
    //                 })
    //                 .catch((err) => {
    //                     toast.error(`Something went wrong! ${err.message}`);
    //                     navigateTO("/user/auth/register");
    //                     setButtonLoading(false);
    //                 });
    //         } else if (type === "PasswordReseterOTP") {
    //             navigateTO("/user/auth/password/reset-password", { "state": userDetails.userEmail });
    //             toast.success("Now! Reset your password");
    //         }
    //     } else {
    //         toast.error("Invalid OTP");
    //         firstInputRef.current.focus();
    //         setOtp("");
    //     }
    // };

    const handleVerifyOTP = (e) => {
        e.preventDefault();
        setButtonLoading(true);
        if (state?.otp === otp.join("")) {
            setTimeout(() => {
                setButtonLoading(false);
                toast.success("OTP matched")
            }, 1500);
        } else {
            toast.error("OTP not matched")
        }

    };

    useEffect(() => {
        // if (!state?.otp) {
        //     navigateTO("/user/register")
        // }
        firstInputRef.current.focus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    return (

        <div className="Auth__UserLoginFormContainer">

            <form className="otpVerifier__Form">
                <h3 className="otpVerifier__Form_heading">
                    <MdOutlineSecurity className="otpVerifier__Form_heading_ICON" />
                </h3>
                <h4 className="otpVerifier__Form_Secondaryheading">
                    Enter one time password sent to
                    <span className="otpVerifier__mailSentTo">
                        mahianshuman491@gmail.com
                        {state?.userDetails?.userEmail}
                    </span>
                </h4>

                <div className="OTPForm__inputboxContainer">
                    {otp.map((data, index) => {
                        return (
                            <input
                                key={index}
                                type="text"
                                id={otp + index}
                                name="otp"
                                maxLength={1}
                                className="OTPForm__input"
                                value={data}
                                onChange={(e) => handleOTPChange(e, index)}
                                onKeyDown={(e) => handleOTPkeydown(e, index)}
                                onFocus={(e) => e.target.select()}
                                ref={index === 0 ? firstInputRef : null}
                                readOnly={buttonLoading}
                            />
                        );
                    })}
                </div>

                <div className="OTP_Form_ButtonContainer">
                    <button
                        className={`OTP__buttons OTPForn__clearButton`}
                        onClick={handleClearOTPinput}
                    >
                        Clear
                    </button>

                    <button
                        className={`OTP__buttons OTPForn__verifyButton`}
                        onClick={handleVerifyOTP}
                    >
                        {buttonLoading ? "NAME" : "Verify"}
                    </button>
                </div>

                {/* <div className="flex items-center justify-center absolute bottom-0 w-full h-[120px] border-t-[1px]">
                <button
                    className={`${buttonLoading && 'pointer-events-none'} continueWithButtons text-brand-red rounded-[10px] text-[16px] font-semibold flex items-center justify-start gap-5 mx-auto border w-[95%] h-[50px] md:w-[420px]`}
                    style={{ backgroundColor: "whiteSmoke" }}
                    onClick={handleChangeEmailAddress}
                >
                    <span className="border-r-[1px] border-brand-red w-[60px] h-[100%] rounded-tl-[10px] rounded-bl-[10px] flex items-center justify-center text-[20px]">
                        <SiGmail />
                    </span>
                    Change Your Email address
                </button>
            </div> */}
            </form>

            <div className="authGotoSignUP_container">
                <Link className={`gotoRegisterPageLINK `} to={"/user/auth/register"}>
                    Change Email address
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
