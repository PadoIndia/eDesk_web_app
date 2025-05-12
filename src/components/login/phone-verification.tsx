"use client";

import React, { useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import { AiOutlineArrowRight } from "react-icons/ai";
import LoginFormOtp from "./login-form-otp";
import { toast } from "react-toastify";
import Logo from "../logo";
import "./login.scss";
import authService from "../../services/api-services/auth.service";
import { LoginPageConstantLines } from "../../utils/constants";

function PhoneVerification() {
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [isOtpSend, setIsOtpSend] = useState<boolean>(false);
  const [mobileNumberInvalid, setMobileNumberInvalid] =
    useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");

  const handlePhoneVerification = async (
    e: React.SyntheticEvent<HTMLFormElement | HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (mobileNumber.length !== 10) {
      toast.error("Phone Number is invalid.");
      setMobileNumberInvalid(true);
      return;
    }
    try {
      const isOtpSend = await authService.sendOtp({
        mobileNumber,
        countryCode: "+91",
        appVersion: "1.0.0",
      });
      if (isOtpSend.status === "success") {
        setIsOtpSend(true);
      } else {
        console.log(isOtpSend.message);
      }
    } catch (error) {
      console.log("error ====>", error);
    }
    setMobileNumberInvalid(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center p-2 position-relative flex-column">
      {isOtpSend ? (
        <LoginFormOtp
          otp={otp}
          setOtp={setOtp}
          number={mobileNumber}
          resendOtp={handlePhoneVerification}
        />
      ) : (
        <form
          className="flex-column LoginFormNumber m-auto"
          onSubmit={handlePhoneVerification}
          noValidate
        >
          <div className="d-flex flex-column mb-4">
            <div className="d-flex mt-4">
              <Logo />
            </div>
            <div className="mt-4 mt-md-5">
              <label className="Form-heading1">
                {LoginPageConstantLines.phoneNumber.heading}
              </label>
              <br />
              <small className="Form-heading3">
                {LoginPageConstantLines.phoneNumber.subTitle}
              </small>
            </div>

            <div className="phone-input-group d-flex mt-md-5 mt-4 align-items-center">
              {/* Flag and code box */}
              <div
                className="form-control w-auto pe-0 flag d-flex ps-1 d-flex align-items-center"
                style={{
                  border: `2px solid`,
                  borderColor: mobileNumberInvalid ? "#CC2C2C" : "",
                  borderWidth: "2px 0px 2px 2px",
                  borderRadius: "0.4rem 0px 0px 0.4rem",
                  padding: "12px 6px",
                }}
              >
                <span>+91</span>
                <img
                  alt="flag-india"
                  src="/india-flag.png"
                  style={{
                    width: 24,
                    height: 16,
                    marginLeft: 8,
                    marginRight: 8,
                    objectFit: "cover",
                  }}
                />
                <span>|</span>
              </div>

              {/* Input field */}
              <input
                type="text"
                autoFocus
                className="form-control mobileInput"
                style={{
                  borderColor: mobileNumberInvalid ? "#CC2C2C" : "",
                  borderLeft: "none",
                  borderWidth: "2px 2px 2px 0px",

                  borderRadius: "0 0.4rem 0.4rem 0",
                  height: "48.2px",
                }}
                placeholder="Enter your Number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </div>

            {/* Error text */}
            {mobileNumberInvalid && (
              <div className="d-flex align-items-center text-danger mt-2">
                <FiAlertCircle className="me-1" />
                <span>Please enter a valid number first</span>
              </div>
            )}
          </div>

          {/* Submit button */}
          <div className="mt-4 mt-md-0">
            <button
              type="submit"
              className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center"
            >
              Continue&nbsp;
              <AiOutlineArrowRight color="#fff" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default PhoneVerification;
