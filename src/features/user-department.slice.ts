import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface Department {
  id: number;
  name: string;
  responsibilities: string;
  slug: string;
  createdOn: string;
  updatedOn: string;
}

interface UserDepartment {
  id: number;
  userId: number;
  departmentId: number;
  isAdmin: boolean;
  createdOn: string;
  updatedOn: string;
  department: Department;
}

interface UserDepartmentState {
  userDepartments: UserDepartment[];
  loading: boolean;
  error: string | null;
}

const initialState: UserDepartmentState = {
  userDepartments: [],
  loading: false,
  error: null,
};



const userDepartmentSlice = createSlice({
    name:"userDepartments",
    initialState,
    reducers:{
        setUserDepartments(state, action: PayloadAction<UserDepartment[]>){
            state.userDepartments = action.payload;
        },
        setError(state, action:PayloadAction<string>){
            state.error = action.payload;
        },
    },
});



export const { setUserDepartments, setError } = userDepartmentSlice.actions;

export default userDepartmentSlice.reducer;
