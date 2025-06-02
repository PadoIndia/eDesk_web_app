import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Department } from "../types/department-team.types";

interface DepartmentState {
  departments: Department[];
  loading: boolean;
  error: string | null;
}

const initialState: DepartmentState = {
  departments: [],
  loading: false,
  error: null,
};

const departmentSlice = createSlice({
    name:"departments",
    initialState,
    reducers:{
        setDepartments(state, action: PayloadAction<Department[]>){
            state.departments = action.payload;
        },
        setError(state, action:PayloadAction<string>){
            state.error = action.payload;
        },
    },
});


export const { setDepartments, setError } = departmentSlice.actions;


export default departmentSlice.reducer;