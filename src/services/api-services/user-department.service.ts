import { ApiResponse } from "../../types/axios.types";
import ApiService from "./api-service";

class UserDepartmentService extends ApiService {
  constructor() {
    super("/admin/user-department");
  }

  createUserDepartment(userDepartment:{userId:number, departmentId:number, isAdmin:boolean}):ApiResponse{
      return this.postData("/", userDepartment);
  }
}

export default new UserDepartmentService();
