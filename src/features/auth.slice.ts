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
import userService from "../services/api-services/user.service";
import { TPermission } from "../types/user.types";

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

export const fetchUserPermissions = createAsyncThunk(
  `auth/permissions`,
  async (userId: number, { rejectWithValue }) => {
    try {
      const resp = await userService.getUserPermissions(userId);
      if (resp.status === "success") {
        return resp.data.map((i) => i.permission.slug) as TPermission[];
      }
      return rejectWithValue(resp.message);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Error while fetching permissions"
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
        state.isLoggedIn = true;
        state.userData = data;
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
        console.log("action", action.payload);
        state.isLoggedIn = true;
        state.isLoading = false;
      });
    builder.addCase(logOut.fulfilled, (state) => {
      state.userData = null;
      state.isLoggedIn = false;
    });
    builder.addCase(fetchUserPermissions.fulfilled, (state, action) => {
      if (state.userData) state.userData.user.permissions = action.payload;
    });
  },
});

export const { checkAuth } = authSlice.actions;
export default authSlice.reducer;
