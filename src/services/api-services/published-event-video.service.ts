import { ApiResponse } from "../../types/axios.types";
import {
  PublishedEventVideoPayload,
  PublishedEventVidResponse,
} from "../../types/event.types";
import ApiService from "./api-service";

class PublishedEventVideoService extends ApiService {
  constructor() {
    super("/admin/published-event-videos");
  }

  getAllPublishedVideos(): ApiResponse<PublishedEventVidResponse[]> {
    return this.getData(``);
  }
  getPublishedVidById(id: number): ApiResponse<PublishedEventVidResponse> {
    return this.getData(`/${id}`);
  }
  createPublishedVid(data: PublishedEventVideoPayload): ApiResponse<number> {
    return this.postData("", data);
  }
  updatePublishedVid(
    id: number,
    data: Partial<PublishedEventVideoPayload>
  ): ApiResponse<PublishedEventVidResponse> {
    return this.putData(`/${id}`, data);
  }
  deletePublishedVid(id: number) {
    return this.deleteData(`/${id}`);
  }
}

export default new PublishedEventVideoService();
