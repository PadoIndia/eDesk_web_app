import { ApiResponse } from "../../types/axios.types";
import { DepartmentResponse } from "../../types/department-team.types";
import ApiService from "./api-service";

class DepartmentService extends ApiService {
  constructor() {
    super("/admin/department-management");
  }

  createDepartment(department: {
    name: string;
    slug: string;
    responsibilities: string;
  }): ApiResponse {
    return this.postData("", department); // Fixed: backend uses empty string not "/"
  }

  getDepartments(): ApiResponse<DepartmentResponse[]> {
    return this.getData(""); // Fixed: backend uses empty string not "/"
  }

  getDepartmentById(departmentId: number): ApiResponse {
    return this.getData(`/${departmentId}`);
  }
}

export default new DepartmentService();
