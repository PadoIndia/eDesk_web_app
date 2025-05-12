import { VerifyOtpResponse } from "./auth.types";

export type AuthReducer = {
  isLoggedIn: boolean;
  isVerifying: boolean;
  userData: VerifyOtpResponse | null;
  isLoading: boolean;
};
