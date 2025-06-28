import { ApiResponse } from "../../types/axios.types";
import ApiService from "./api-service";
import {
  LeaveTypeResponse,
  CreateLeaveTypeRequest,
  UpdateLeaveTypeRequest,
} from "../../types/leave.types";

class LeaveTypeService extends ApiService {
  constructor() {
    super("/admin/leave-type");
  }

  createLeaveType(
    data: CreateLeaveTypeRequest
  ): ApiResponse<LeaveTypeResponse> {
    return this.postData("/", data);
  }

  getLeaveTypes(): ApiResponse<LeaveTypeResponse[]> {
    return this.getData("/");
  }

  updateLeaveType(
    id: number,
    data: UpdateLeaveTypeRequest
  ): ApiResponse<LeaveTypeResponse> {
    return this.putData(`/${id}`, data);
  }

  deleteLeaveType(id: number): ApiResponse<void> {
    return this.deleteData(`/${id}`);
  }
}

export default new LeaveTypeService();
