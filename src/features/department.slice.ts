import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DepartmentResponse } from "../types/department-team.types";

interface DepartmentState {
  departments: DepartmentResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: DepartmentState = {
  departments: [],
  loading: false,
  error: null,
};

const departmentSlice = createSlice({
  name: "departments",
  initialState,
  reducers: {
    setDepartments(state, action: PayloadAction<DepartmentResponse[]>) {
      state.departments = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const { setDepartments, setError } = departmentSlice.actions;

export default departmentSlice.reducer;
