import React, { useState } from "react";

function OtpVerifier({ title, verifyOTP }) {
  const [otp, setOtp] = useState("");

  const handleInputOnChange = (e) => {
    console.log(e);
    if (!isNaN(e.target.value)) {
      setOtp(e.target.value.trim());
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
        />
        <div className="otpVerifier__buttonContainer">
          <button className="otpVerifier__button" type="button">
            Cancle
          </button>
          <button className="otpVerifier__button">Veriry</button>
        </div>
      </form>
    </div>
  );
}

export default OtpVerifier;
