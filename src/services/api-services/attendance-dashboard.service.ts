import {
  ManualStatusData,
  MissPunchRequestData,
  UserAttendanceItem,
  UserDashboardData,
} from "../../types/attendance-dashboard.types";
import { ApiResponse } from "../../types/axios.types";
import ApiService from "./api-service";

class AttendanceDashboardService extends ApiService {
  constructor() {
    super("/admin/attendance");
  }

  getSheetData(params: {
    departmentId?: number;
    month: number;
    year: number;
    leaveSchemeId: number;
  }): ApiResponse {
    return this.getData(`/sheet`, { params });
  }

  getDashboardData(
    userId: number,
    month?: number,
    year?: number
  ): ApiResponse<UserDashboardData> {
    const params = new URLSearchParams();
    if (month) params.append("month", month.toString());
    if (year) params.append("year", year.toString());

    return this.getData(`/dashboard/${userId}?${params.toString()}`);
  }

  getDepartmentUsers(
    month?: number,
    year?: number
  ): ApiResponse<UserAttendanceItem[]> {
    const params = new URLSearchParams();
    if (month) params.append("month", month.toString());
    if (year) params.append("year", year.toString());

    return this.getData(`/department-users?${params.toString()}`);
  }

  getPendingRequests(adminUserId: number): ApiResponse {
    return this.getData(`/pending-requests/${adminUserId}`);
  }

  createMissPunchRequest(requestData: MissPunchRequestData): ApiResponse {
    return this.postData(`/miss-punch-request`, requestData);
  }

  updateManualStatus(statusData: ManualStatusData): ApiResponse {
    return this.putData("/manual-status", statusData);
  }

  approveMissPunchRequest(
    punchId: number,
    approvalData: {
      isApproved: boolean;
      comment?: string;
      approvedBy?: number;
    }
  ): ApiResponse {
    return this.putData(`/miss-punch-request/${punchId}/approve`, approvalData);
  }

  syncUserAttendance(
    userId: number,
    params: {
      month: number;
      year: number;
    }
  ): ApiResponse<boolean> {
    return this.getData(`/${userId}/sync`, { params });
  }
}

export default new AttendanceDashboardService();
