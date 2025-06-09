import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TaskReducer } from "../types/features";

const initialState: TaskReducer = {
  payload: null,
  action: "NEW",
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTaskPayload: (state, action: PayloadAction<TaskReducer>) => {
      state.payload = action.payload.payload;
      state.action = action.payload.action;
    },
    removeTaskPayload: (state) => {
      state.payload = null;
      state.action = "NEW";
    },
  },
  extraReducers: () => {},
});

export const { setTaskPayload, removeTaskPayload } = taskSlice.actions;
export default taskSlice.reducer;
