import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserDepartmentResp } from "../types/user.types";

interface UserDepartmentState {
  userDepartments: UserDepartmentResp[];
  loading: boolean;
  error: string | null;
}

const initialState: UserDepartmentState = {
  userDepartments: [],
  loading: false,
  error: null,
};

const userDepartmentSlice = createSlice({
  name: "userDepartments",
  initialState,
  reducers: {
    setUserDepartments(state, action: PayloadAction<UserDepartmentResp[]>) {
      state.userDepartments = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const { setUserDepartments, setError } = userDepartmentSlice.actions;

export default userDepartmentSlice.reducer;
