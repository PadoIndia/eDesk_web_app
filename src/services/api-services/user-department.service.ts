import { ApiResponse } from "../../types/axios.types";
import ApiService from "./api-service";

class UserDepartmentService extends ApiService {
  constructor() {
    super("/admin/user-department");
  }

  createUserDepartment(userDepartment: {
    userId: number;
    departmentId: number;
    isAdmin: boolean;
  }): ApiResponse {
    return this.postData("/", userDepartment);
  }

  updateUserDepartment(
    userId: number,
    departmentId: number,
    isAdmin: boolean
  ): ApiResponse {
    return this.putData(`/${userId}/${departmentId}`, {isAdmin});
  }

  getByDepartment(departmentId: number): ApiResponse {
    return this.getData(`/department/${departmentId}`);
  }

  getUserDepartmentByUserId(userId: number): ApiResponse {
    return this.getData(`/${userId}`);
  }

  getDepartmentManager(departmentId: number): ApiResponse{
    return this.getData(`/department/manager/${departmentId}`);
  }

  deleteUserDepartment(userId: number, departmentId: number): ApiResponse {
    return this.deleteData(`/${userId}/${departmentId}`);
  }
}

export default new UserDepartmentService();