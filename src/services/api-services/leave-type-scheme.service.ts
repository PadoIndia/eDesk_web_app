import { ApiResponse } from "../../types/axios.types";
import ApiService from "./api-service";
import { LeaveTypeScheme, CreateLeaveTypeSchemeRequest, UpdateLeaveTypeSchemeRequest } from "../../types/leave.types";

class LeaveTypeSchemeService extends ApiService {
  constructor() {
    super("/admin/leave-type-scheme");
  }

  createLeaveTypeScheme(data: CreateLeaveTypeSchemeRequest): ApiResponse<LeaveTypeScheme> {
    return this.postData("/", data);
  }

  getLeaveTypeSchemes(): ApiResponse<LeaveTypeScheme[]> {
    return this.getData("/");
  }

  updateLeaveTypeScheme(id: number, data: UpdateLeaveTypeSchemeRequest): ApiResponse<LeaveTypeScheme> {
    return this.putData(`/${id}`, data);
  }

  deleteLeaveTypeScheme(id: number): ApiResponse<void> {
    return this.deleteData(`/${id}`);
  }
}

export default new LeaveTypeSchemeService();