import { ApiResponse } from "../../types/axios.types";
import ApiService from "./api-service";
import {
  ApprovePayload,
  PunchPayload,
  PunchQueryParams,
  PunchResponse,
} from "../../types/punch-data.types";

class PunchDataService extends ApiService {
  constructor() {
    super("/admin/punches");
  }

  createPunchData(data: PunchPayload): ApiResponse<PunchResponse> {
    return this.postData("/", data);
  }

  getPunches(params?: PunchQueryParams): ApiResponse<PunchResponse[]> {
    return this.getData(``, { params });
  }

  approvePunch(id: number, data: ApprovePayload): ApiResponse<number> {
    return this.postData(`/${id}/approve`, data);
  }
  updatePunch(
    id: number,
    data: Partial<PunchResponse>
  ): ApiResponse<PunchResponse> {
    return this.putData(`/${id}`, data);
  }
}

export default new PunchDataService();
