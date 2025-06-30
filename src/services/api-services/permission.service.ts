import { ApiResponse } from "../../types/axios.types";
import { PermissionResponse } from "../../types/permission.types";
import ApiService from "./api-service";

class PermissionService extends ApiService {
  constructor() {
    super("/admin/permissions");
  }

  getAllPermissions(): ApiResponse<PermissionResponse[]> {
    return this.getData("");
  }

  getPermissionById(id: number) {
    return this.getData(`/${id}`);
  }
}

export default new PermissionService();
