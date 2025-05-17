import { ApiResponse } from "../../types/axios.types";
import ApiService from "./api-service";

class DepartmentTeamService extends ApiService {
  constructor() {
    super("/admin/department-management");
  }

  createDepartment(department: {
    name: string;
    slug: string;
    responsibilities: string;
  }): ApiResponse {
    return this.postData("/", department);
  }

  getDepartments():ApiResponse{
    return this.getData("/");
  }

}



export default new DepartmentTeamService();
