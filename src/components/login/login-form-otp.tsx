"use client";

import { memo, useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { toast } from "react-toastify";
import { LoginPageConstantLines } from "../../utils/constants";
import { getOperatingSystem, getOSVersion } from "../../utils/helper";
import authService from "../../services/api-services/auth.service";

type Props = {
  otp: string;
  setOtp: (e: string) => void;
  number: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resendOtp: (e: any) => void;
};

function LoginFormOtp({ otp, setOtp, number, resendOtp }: Props) {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds > 0) {
          return prevSeconds - 1;
        }
        clearInterval(timer);
        return 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (otp.length === 4) {
      handleOtpVerification();
    }
  }, [otp]);

  const handleOtpChange = (otp: string) => {
    if (otp.length < 4) {
      const OtpBoxes = document.getElementsByClassName(
        "Otp_Box"
      ) as unknown as HTMLElement[];
      for (let i = 0; i < OtpBoxes.length; i++) {
        OtpBoxes[i].style.border = "";
      }
    }
  };

  const handleOtpVerification = async () => {
    if (otp.length !== 4) {
      toast.error("Please enter correct OTP.");
      return;
    }
    try {
      const fpPromise = FingerprintJS.load();
      const fp = await fpPromise;
      const result = await fp.get();
      const deviceInfo = {
        uniqueId: result.visitorId,
        os: getOperatingSystem(),
        osVersion: getOSVersion(),
        deviceName: getOperatingSystem(),
        buildId: "",
        brand: "",
        deviceId: result.visitorId,
        displayId: "",
        hardwareId: "",
        manufacturerName: "",
        productName: "",
      };
      const resp = await authService.verifyOtp({
        otp,
        deviceInfo,
        countryCode: "91",
        mobileNumber: number,
      });
      if (resp.status === "success") {
        localStorage.setItem("@user", btoa(JSON.stringify(resp.data)));
        window.location.href = "/";
      }
      // OTP verification API call goes here
    } catch (error) {
      console.log("error ===>", error);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center w-100"
      style={{ maxHeight: "720px", height: "100%" }}
    >
      <div className="col-12 col-md-8">
        <div
          className="d-flex flex-column justify-content-start justify-content-md-center"
          style={{ height: "100vh" }}
        >
          <div className="d-flex flex-column">
            <div className="d-flex d-md-none mt-4">
              {/* Add image/logo here if needed */}
            </div>

            <div className="mt-4 mt-md-5">
              <label className="Form-heading1">
                {LoginPageConstantLines.otp.heading}
              </label>
              <br />
              <p className="Form-heading3">
                {LoginPageConstantLines.otp.subTitle} {number}
              </p>
            </div>

            <OTPInput
              value={otp}
              onChange={(otp) => {
                setOtp(otp);
                handleOtpChange(otp);
              }}
              numInputs={4}
              inputType="number"
              inputStyle="Otp_Box"
              containerStyle="Otp_Conta"
              shouldAutoFocus
              renderInput={(props) => <input {...props} />}
            />

            <p className="text-muted mt-4">
              {LoginPageConstantLines.otp.resendOtp}{" "}
              {seconds > 30 ? (
                seconds - 32 < 10 ? (
                  `0${seconds - 30}`
                ) : (
                  seconds - 30
                )
              ) : (
                <a href="" onClick={resendOtp} className="otp-box-but">
                  Resend
                </a>
              )}
            </p>

            {seconds === 0 && (
              <p className="text-muted mt-2">
                {LoginPageConstantLines.otp.issue}{" "}
                <a
                  href="https://www.esaral.com/contact"
                  className="otp-box-but"
                >
                  Contact Us
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(LoginFormOtp);
