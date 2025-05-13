import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  decryptAndParseTokenFromStorage,
  getOperatingSystem,
  getOSVersion,
} from "../utils/helper";
import { AuthReducer } from "../types/slice.types";
import { VerifyOtpPayload } from "../types/auth.types";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import authService from "../services/api-services/auth.service";

const initialState: AuthReducer = {
  isLoggedIn: false,
  isLoading: false,
  isVerifying: true,
  userData: null,
};

export const logIn = createAsyncThunk(
  `auth/verify`,
  async (data: Omit<VerifyOtpPayload, "deviceInfo">, { rejectWithValue }) => {
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
      const resp = await authService.verifyOtp({ ...data, deviceInfo });

      if (resp.status === "success") {
        return resp.data;
      }
      return rejectWithValue(resp.message);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Error while verifying"
      );
    }
  }
);

export const logOut = createAsyncThunk(`auth/logOut`, async () => {
  localStorage.removeItem("@user");
  return Promise.resolve();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    checkAuth(state) {
      const data = decryptAndParseTokenFromStorage();
      if (data) {
        state.userData = data;
        state.isLoggedIn = true;
      } else state.isLoggedIn = false;
      state.isVerifying = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logIn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logIn.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.isLoggedIn = true;
        state.isLoading = false;
      });
    builder.addCase(logOut.fulfilled, (state) => {
      state.userData = null;
      state.isLoggedIn = false;
    });
  },
});

export const { checkAuth } = authSlice.actions;
export default authSlice.reducer;
