import { AxiosProgressEvent } from "axios";
import { ApiResponse } from "../../types/axios.types";
import ApiService from "./api-service";
import {
  GetLeaveRequestsQuery,
  LeaveRequestPayload,
  LeaveRequestResponse,
} from "../../types/leave.types";
import { UserDepartmentResp, UserTeamResp } from "../../types/user.types";
import {
  PunchPayload,
  PunchQueryParams,
  PunchResponse,
} from "../../types/punch-data.types";

class GeneralService extends ApiService {
  constructor() {
    super("");
  }

  uploadToS3(
    data: {
      image: File;
      hash: string;
    }[],
    onUploadProgress?: (pE: AxiosProgressEvent) => void
  ): ApiResponse<{ id: number; url: string }[]> {
    const formData = new FormData();

    data.forEach((d) => {
      formData.append("files", d.image);
      formData.append("hashes", d.hash);
    });

    return this.postData("/uploads", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    });
  }

  getUserDepartments(userId: number): ApiResponse<UserDepartmentResp[]> {
    return this.getData(`/users/${userId}/departments`);
  }

  getUserTeams(userId: number): ApiResponse<UserTeamResp[]> {
    return this.getData(`/users/${userId}/teams`);
  }

  // Leave Request related api calls for current logged in user
  createLeaveRequest(data: LeaveRequestPayload): ApiResponse<number> {
    return this.postData("/users/leave-requests", data);
  }
  getMyLeaveRequests(
    params?: GetLeaveRequestsQuery
  ): ApiResponse<LeaveRequestResponse[]> {
    return this.getData(`/users/leave-requests`, { params });
  }

  // Punch related api calls for current logged in user
  getUserPunchRequests(
    params: Omit<PunchQueryParams, "type" | "userId">
  ): ApiResponse<PunchResponse[]> {
    return this.getData(`/users/punches`, { params });
  }

  createPunchRequest(data: PunchPayload): ApiResponse<PunchResponse> {
    return this.postData(`/users/punches`, data);
  }

  updatePunch(punchId: number, data: Partial<PunchPayload>) {
    return this.putData(`/users/punches/${punchId}`, data);
  }

  deletePunchRequest(punchId: number): ApiResponse<number> {
    return this.deleteData(`/users/punches/${punchId}`);
  }
}

export default new GeneralService();
