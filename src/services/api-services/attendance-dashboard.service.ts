import {
  AutoAttendanceStatus,
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

  syncUserAttendance(
    userId: number,
    params: {
      month: number;
      year: number;
    }
  ): ApiResponse<boolean> {
    return this.getData(`/${userId}/sync`, { params });
  }

  updateAttendanceStatus(
    id: number,
    data: { status: AutoAttendanceStatus; comment?: string }
  ) {
    return this.putData(`-data/${id}`, data);
  }
}

export default new AttendanceDashboardService();
