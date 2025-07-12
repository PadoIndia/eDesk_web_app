import { AxiosRequestConfig } from "axios";
import { ApiResponse } from "../../types/axios.types";
import {
  DepartmentResponse,
  DepartmentTeamResponse,
  TeamPayload as DepartmentPayload,
} from "../../types/department-team.types";
import ApiService from "./api-service";

class DepartmentService extends ApiService {
  constructor() {
    super("/admin/departments");
  }

  createDepartment(department: DepartmentPayload): ApiResponse {
    return this.postData("", department);
  }

  updateDepartment(id: number, data: Partial<DepartmentPayload>): ApiResponse {
    return this.putData(`/${id}`, data);
  }

  getDepartments(
    params?: AxiosRequestConfig["params"]
  ): ApiResponse<DepartmentResponse[]> {
    return this.getData("", { params });
  }

  deleteDepartment(id: number): ApiResponse {
    return this.deleteData(`/${id}`);
  }

  getDepartmentById(departmentId: number): ApiResponse {
    return this.getData(`/${departmentId}`);
  }

  addTeamToDepartment(
    departmentId: number,
    teamId: number
  ): ApiResponse<DepartmentTeamResponse> {
    return this.postData(`/${departmentId}/teams`, { teamId });
  }
  removeTeamFromDepartment(
    departmentId: number,
    teamId: number
  ): ApiResponse<DepartmentTeamResponse> {
    return this.deleteData(`/${departmentId}/teams/${teamId}`);
  }

  addUserToDepartment(
    depratmentId: number,
    data: { userId: number; isAdmin: boolean }
  ): ApiResponse {
    return this.postData(`/${depratmentId}/users`, data);
  }

  updateDepartmentUser(
    departmentId: number,
    userId: number,
    isAdmin: boolean
  ): ApiResponse {
    return this.putData(`/${departmentId}/users/${userId}`, { isAdmin });
  }

  removeUserFromDepartment(departmentId: number, userId: number): ApiResponse {
    return this.deleteData(`/${departmentId}/users/${userId}`);
  }
}

export default new DepartmentService();
