import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userService from "../services/api-services/user.service";
import { UserReducer } from "../types/features";

const initialState: UserReducer = {
  data: null,
  errors: null,
  isLoading: false,
  current: null,
};

export const getAvailableUsers = createAsyncThunk(
  "users/all",
  async (_, { rejectWithValue }) => {
    const res = await userService.getAllUsers();
    if (res.status == "success") {
      return res.data;
    }
    return rejectWithValue(res.message);
  }
);

export const getUserDetails = createAsyncThunk(
  `users/current`,
  async (id: number, { rejectWithValue }) => {
    const res = await userService.getUserDetailsById(id);
    if (res.status == "success") {
      return res.data;
    }
    return rejectWithValue(res.message);
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAvailableUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAvailableUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload;
      })
      .addCase(getAvailableUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      });
    builder
      .addCase(getUserDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.current = action.payload;
      });
  },
});

export default userSlice.reducer;
