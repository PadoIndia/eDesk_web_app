import { ApiResponse } from "../../types/axios.types";
import { SendOtpPayload, VerifyOtpPayload } from "../../types/user.types";
import ApiService from "./api-service";

type LoginResponse = {
  token: string;
};

class AuthService extends ApiService {
  constructor() {
    super("/auth");
  }

  sendOtp(data: SendOtpPayload) {
    return this.postData("/send-otp", data);
  }

  verifyOtp(data: VerifyOtpPayload): ApiResponse<LoginResponse> {
    return this.postData("/verify-otp", data);
  }
}

export default new AuthService();
