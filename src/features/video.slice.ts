import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VideoFile, VideoStatus } from "../types/video.types";

type VideoSlice = {
  videos: VideoFile[];
};

const initialState: VideoSlice = {
  videos: [],
};

const videoSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {
    updateProgress(
      state,
      action: PayloadAction<{ id: string; uploadedSize: number }>
    ) {
      const { id, uploadedSize } = action.payload;
      const vidIndex = state.videos.findIndex((i) => i.id == id);
      if (vidIndex > -1) {
        const vid = state.videos[vidIndex];
        state.videos[vidIndex].uploadedSize = uploadedSize;
        state.videos[vidIndex].progress = Number(
          ((uploadedSize / vid.size) * 100).toFixed(2)
        );
      }
    },
    updateStatus(
      state,
      action: PayloadAction<{ id: string; status: VideoStatus }>
    ) {
      const { id, status } = action.payload;
      const vidIndex = state.videos.findIndex((i) => i.id == id);
      if (vidIndex > -1) {
        state.videos[vidIndex].status = status;
      }
    },
    updateThumbnail(
      state,
      action: PayloadAction<{ id: string; thumbnailUrl: string }>
    ) {
      const { id, thumbnailUrl } = action.payload;
      const vidIndex = state.videos.findIndex((i) => i.id == id);
      if (vidIndex > -1) {
        state.videos[vidIndex].thumbnailUrl = thumbnailUrl;
      }
    },
    addVideos(state, action: PayloadAction<VideoFile[]>) {
      state.videos.push(...action.payload);
    },
    updateVideoId(
      state,
      action: PayloadAction<{ id: string; video_id: number }>
    ) {
      const { id, video_id } = action.payload;
      const vidIndex = state.videos.findIndex((vid) => vid.id === id);
      if (vidIndex > -1) {
        state.videos[vidIndex].video_id = video_id;
      }
    },
    removeVideo(state, action: PayloadAction<string>) {
      state.videos = state.videos.filter((i) => i.id !== action.payload);
    },
    removeCompleted(state) {
      state.videos = state.videos.filter((i) => i.status !== "uploaded");
    },
  },
});

export const {
  updateProgress,
  updateStatus,
  updateThumbnail,
  addVideos,
  updateVideoId,
  removeVideo,
  removeCompleted,
} = videoSlice.actions;

export default videoSlice.reducer;
