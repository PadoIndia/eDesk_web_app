import { ApiResponse } from "../../types/axios.types";
import { TagPayload, TagResponse } from "../../types/tag.types";
import ApiService from "./api-service";

class TagService extends ApiService {
  constructor() {
    super("/tags");
  }
  getAllTags(): ApiResponse<TagResponse[]> {
    return this.getData(``);
  }
  getTagById(id: number): ApiResponse<TagResponse> {
    return this.getData(`/${id}`);
  }
  createTag(data: TagPayload): ApiResponse<number> {
    return this.postData(``, data);
  }
  updateTag(id: number, data: Partial<TagPayload>): ApiResponse<TagResponse> {
    return this.putData(`/${id}`, data);
  }
  deleteTag(id: number): ApiResponse<TagResponse> {
    return this.deleteData(`/${id}`);
  }
}

export default new TagService();
