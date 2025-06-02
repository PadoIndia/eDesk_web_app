
// services/api-services/leave-request.service.ts
import { ApiResponse } from "../../types/axios.types";
import ApiService from "./api-service";
import { 
  CreateLeaveRequestRequest, 
  UpdateLeaveRequestRequest,
  GetLeaveRequestsQuery,
  GetMyLeaveRequestsQuery,
  GetManagerLeaveRequestsQuery,
  GetHRLeaveRequestsQuery,
  ManagerApproveRejectLeaveRequestRequest,
  HRApproveRejectLeaveRequestRequest
} from '../../types/leave.types';

class LeaveRequestService extends ApiService {
  constructor() {
    super("/admin/leave-request");
  }
  
  // POST /api/leave-requests - Create a new leave request
  createLeaveRequest(data: CreateLeaveRequestRequest): ApiResponse {
    return this.postData("/", data);
  }

  // GET /api/leave-requests - Get all leave requests (with filters)
  getLeaveRequests(params?: GetLeaveRequestsQuery): ApiResponse {
    return this.getData("/", { params });
  }

  // GET /api/leave-requests/my - Get my leave requests
  getMyLeaveRequests(params?: GetMyLeaveRequestsQuery): ApiResponse {
    return this.getData("/my", { params });
  }

  // GET /api/leave-requests/manager/for-approval - Get leave requests for manager approval
  getLeaveRequestsForManagerApproval(params?: GetManagerLeaveRequestsQuery): ApiResponse {
    return this.getData("/manager/for-approval", { params });
  }

  // GET /api/leave-requests/hr/for-approval - Get leave requests for HR approval
  getLeaveRequestsForHRApproval(params?: GetHRLeaveRequestsQuery): ApiResponse {
    return this.getData("/hr/for-approval", { params });
  }

  // GET /api/leave-requests/:leaveRequestId - Get leave request by ID
  getLeaveRequestById(leaveRequestId: number): ApiResponse {
    return this.getData(`/${leaveRequestId}`);
  }

  // PUT /api/leave-requests/:leaveRequestId - Update leave request
  updateLeaveRequest(leaveRequestId: number, data: UpdateLeaveRequestRequest): ApiResponse {
    return this.putData(`/${leaveRequestId}`, data);
  }

  // PATCH /api/leave-requests/:leaveRequestId/manager/approve-reject - Manager approve or reject leave request
  managerApproveRejectLeaveRequest(leaveRequestId: number, data: ManagerApproveRejectLeaveRequestRequest): ApiResponse {
    return this.patchData(`/${leaveRequestId}/manager/approve-reject`, data);
  }

  // PATCH /api/leave-requests/:leaveRequestId/hr/approve-reject - HR approve or reject leave request
  hrApproveRejectLeaveRequest(leaveRequestId: number, data: HRApproveRejectLeaveRequestRequest): ApiResponse {
    return this.patchData(`/${leaveRequestId}/hr/approve-reject`, data);
  }

  // PATCH /api/leave-requests/:leaveRequestId/cancel - Cancel leave request
  cancelLeaveRequest(leaveRequestId: number): ApiResponse {
    return this.patchData(`/${leaveRequestId}/cancel`);
  }

  // DELETE /api/leave-requests/:leaveRequestId - Delete leave request
  deleteLeaveRequest(leaveRequestId: number): ApiResponse {
    return this.deleteData(`/${leaveRequestId}`);
  }
}

export default new LeaveRequestService();
