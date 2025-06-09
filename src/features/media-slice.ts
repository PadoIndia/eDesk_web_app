import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { MediaReducer, UploadStatus } from "../types/features";

const initialState: Record<number, MediaReducer> = {};

const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {
    initState(state, action: PayloadAction<number>) {
      if (!state[action.payload]) {
        state[action.payload] = {
          files: [],
          data: null,
          status: "none",
          progress: 0,
          type: "text",
        };
      }
    },
    setUploadStatus: (
      state,
      action: PayloadAction<{
        status: UploadStatus;
        chatId: number;
        type?: MediaReducer["type"];
      }>
    ) => {
      const { chatId, status } = action.payload;
      state[chatId].status = status;
    },
    setUploadProgress: (
      state,
      action: PayloadAction<{ progress: number; chatId: number }>
    ) => {
      const { chatId, progress } = action.payload;
      state[chatId].progress = progress;
    },
    setMediaData: (
      state,
      action: PayloadAction<{
        chatId: number;
        type: MediaReducer["type"];
        data?: MediaReducer["data"];
        files?: MediaReducer["files"];
      }>
    ) => {
      const { chatId, files = [], type, data } = action.payload;
      state[chatId].type = type;
      if (data) state[chatId].data = data;
      else state[chatId].data = null;
      if (action.payload.files) state[chatId].files = files;
      else state[chatId].files = [];
    },
  },
});

export const { setUploadProgress, initState, setUploadStatus, setMediaData } =
  mediaSlice.actions;

export default mediaSlice.reducer;
