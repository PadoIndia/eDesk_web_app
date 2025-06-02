import { ApiResponse } from "../../types/axios.types";
import ApiService from "./api-service";

class DepartmentTeamService extends ApiService {
  constructor() {
    super("/admin/department-team");
  }

  linkTeamToDepartment(departmentId: number, teamId: number): ApiResponse {
    return this.postData("/", { departmentId, teamId });
  }

  getTeamsByDepartment(departmentId: number): ApiResponse {
    return this.getData(`/department/${departmentId}`);
  }

  unlinkTeam(linkId: number): ApiResponse {
    return this.deleteData(`/${linkId}`);
  }
}

export default new DepartmentTeamService();