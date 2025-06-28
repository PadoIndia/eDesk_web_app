import { ApiResponse } from "../../types/axios.types";
import ApiService from "./api-service";
import {
  UpdateLeaveRequestRequest,
  GetLeaveRequestsQuery,
  ApproveRejectLeaveRequestRequest,
  LeaveRequestResponse,
  LeaveRequestPayload,
} from "../../types/leave.types";

class LeaveRequestService extends ApiService {
  constructor() {
    super("/admin/leave-request");
  }

  createLeaveRequest(data: LeaveRequestPayload): ApiResponse<number> {
    return this.postData("/", data);
  }

  getLeaveRequests(
    params?: GetLeaveRequestsQuery
  ): ApiResponse<LeaveRequestResponse[]> {
    return this.getData("/", { params });
  }

  getLeaveRequestById(leaveRequestId: number): ApiResponse {
    return this.getData(`/${leaveRequestId}`);
  }

  updateLeaveRequest(
    leaveRequestId: number,
    data: UpdateLeaveRequestRequest
  ): ApiResponse {
    return this.putData(`/${leaveRequestId}`, data);
  }

  approveRejectLeaveRequest(
    leaveRequestId: number,
    data: ApproveRejectLeaveRequestRequest
  ): ApiResponse {
    return this.patchData(`/${leaveRequestId}`, data);
  }

  cancelLeaveRequest(leaveRequestId: number): ApiResponse {
    return this.patchData(`/${leaveRequestId}/cancel`);
  }

  deleteLeaveRequest(leaveRequestId: number): ApiResponse {
    return this.deleteData(`/${leaveRequestId}`);
  }
}

export default new LeaveRequestService();
