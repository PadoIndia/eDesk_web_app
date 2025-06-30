import { ApiResponse } from "../../types/axios.types";
import ApiService from "./api-service";
import {
  LeaveScheme,
  CreateLeaveSchemeRequest,
  UpdateLeaveSchemeRequest,
} from "../../types/leave.types";
class LeaveSchemeService extends ApiService {
  constructor() {
    super("/admin/leave-scheme");
  }

  createLeaveScheme(data: CreateLeaveSchemeRequest): ApiResponse<LeaveScheme> {
    return this.postData("/", data);
  }

  getLeaveSchemes(): ApiResponse<LeaveScheme[]> {
    return this.getData("/");
  }

  updateLeaveScheme(
    id: number,
    data: UpdateLeaveSchemeRequest
  ): ApiResponse<LeaveScheme> {
    return this.putData(`/${id}`, data);
  }

  deleteLeaveScheme(id: number): ApiResponse<void> {
    return this.deleteData(`/${id}`);
  }

  getLeaveSchemeById(id: number, params?: { userId: number }): ApiResponse {
    return this.getData(`/${id}`, { params });
  }
}
export default new LeaveSchemeService();
