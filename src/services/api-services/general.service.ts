import { AxiosProgressEvent } from "axios";
import { ApiResponse } from "../../types/axios.types";
import ApiService from "./api-service";
import {
  GetLeaveRequestsQuery,
  LeaveRequestPayload,
  LeaveRequestResponse,
} from "../../types/leave.types";
import { UserDepartmentResp, UserTeamResp } from "../../types/user.types";

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

  createLeaveRequest(data: LeaveRequestPayload): ApiResponse<number> {
    return this.postData("/users/leave-requests", data);
  }

  getUserDepartments(userId: number): ApiResponse<UserDepartmentResp[]> {
    return this.getData(`/users/${userId}/departments`);
  }

  getUserTeams(userId: number): ApiResponse<UserTeamResp[]> {
    return this.getData(`/users/${userId}/teams`);
  }

  getMyLeaveRequests(
    params?: GetLeaveRequestsQuery
  ): ApiResponse<LeaveRequestResponse[]> {
    return this.getData(`/users/leave-requests`, { params });
  }
}

export default new GeneralService();
