import { AxiosRequestConfig } from "axios";
import { ApiResponse } from "../../types/axios.types";
import { DepartmentResponse } from "../../types/department-team.types";
import ApiService from "./api-service";

class DepartmentService extends ApiService {
  constructor() {
    super("/admin/departments");
  }

  createDepartment(department: {
    name: string;
    slug: string;
    responsibilities: string;
  }): ApiResponse {
    return this.postData("", department);
  }

  getDepartments(
    params?: AxiosRequestConfig["params"]
  ): ApiResponse<DepartmentResponse[]> {
    return this.getData("", { params });
  }

  getDepartmentById(departmentId: number): ApiResponse {
    return this.getData(`/${departmentId}`);
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
