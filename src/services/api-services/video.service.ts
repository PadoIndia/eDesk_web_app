import { AxiosRequestConfig } from "axios";
import { ApiResponse } from "../../types/axios.types";
import { TagPayload } from "../../types/tag.types";
import {
  ICreateVideoOnServerRequest,
  ICreateVideoOnServerResponse,
  SingleVideoResponse,
  TimestampPayload,
  TimestampResponse,
  VideoDownloadOptions,
  VideoPayload,
  VideoResponse,
  VideoViewDurationPayload,
  VidTagResponse,
} from "../../types/video.types";
import ApiService from "./api-service";

class VideoService extends ApiService {
  constructor() {
    super("/admin/videos");
  }
  getAllVideos(options?: AxiosRequestConfig): ApiResponse<VideoResponse[]> {
    return this.getData("", options);
  }
  getVideoById(id: number): ApiResponse<SingleVideoResponse> {
    return this.getData(`/${id}`);
  }
  createVideo({
    name,
    eventId,
    fileName,
  }: ICreateVideoOnServerRequest): ApiResponse<ICreateVideoOnServerResponse> {
    return this.postData(``, {
      name,
      eventId,
      source: "GCORE",
      fileName,
    });
  }

  updateVideo(
    id: number,
    data: Partial<VideoPayload>
  ): ApiResponse<VideoPayload & { id: number }> {
    return this.putData(`/${id}`, data);
  }
  deleteVideo(id: number) {
    return this.deleteData(`/${id}`);
  }
  addNewVideoTag(id: number, data: TagPayload): ApiResponse<VidTagResponse> {
    return this.postData(`/${id}/tags`, data);
  }
  addVideoTag(id: number, tagId: number) {
    return this.postData(`/${id}/tags/${tagId}`, {});
  }
  removeVideoTag(id: number, tagId: number) {
    return this.deleteData(`/${id}/tags/${tagId}`);
  }

  getTimestamps(id: number): ApiResponse<TimestampResponse[]> {
    return this.getData(`/${id}/timestamps`);
  }

  addTimestamp(
    id: number,
    data: TimestampPayload
  ): ApiResponse<TimestampResponse> {
    return this.postData(`/${id}/timestamps`, data);
  }
  updateTimestamp(
    id: number,
    timestampId: number,
    data: Partial<TimestampPayload>
  ): ApiResponse<TimestampResponse> {
    return this.putData(`/${id}/timestamps/${timestampId}`, data);
  }
  deleteTimestamp(id: number, timestampId: number) {
    return this.deleteData(`/${id}/timestamps/${timestampId}`);
  }

  addViewDuration(
    id: number,
    data: VideoViewDurationPayload[]
  ): ApiResponse<{ count: number }> {
    return this.postData(`/${id}/view-duration`, data);
  }

  getDownloadOptions(videoId: string): ApiResponse<VideoDownloadOptions[]> {
    return this.getData(`/downloads`, { params: { videoId } });
  }

  updateGCoreVideo(videoId: string, status: "error" | "success"): ApiResponse {
    return this.postData(
      `/gcore`,
      { status },
      {
        params: {
          videoId,
        },
      }
    );
  }
}

export default new VideoService();
