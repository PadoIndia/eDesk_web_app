import { ApiResponse } from "../../types/axios.types";
import {
  SendOtpPayload,
  VerifyOtpPayload,
  VerifyOtpResponse,
} from "../../types/auth.types";
import ApiService from "./api-service";

class AuthService extends ApiService {
  constructor() {
    super("/admin/auth");
  }

  sendOtp(data: SendOtpPayload) {
    return this.postData("/send-otp", data);
  }

  verifyOtp(data: VerifyOtpPayload): ApiResponse<VerifyOtpResponse> {
    return this.postData("/verify-otp", data);
  }
}

export default new AuthService();
