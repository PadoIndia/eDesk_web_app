// services/api-services/leave-type.service.ts
import { ApiResponse } from "../../types/axios.types";
import ApiService from "./api-service";
import { 
  LeaveType, 
  CreateLeaveTypeRequest, 
  UpdateLeaveTypeRequest 
} from '../../types/leave.types';

class LeaveTypeService extends ApiService {
  constructor() {
    super("/admin/leave-type");
  }
  
  createLeaveType(data: CreateLeaveTypeRequest): ApiResponse<LeaveType> {
    return this.postData("/", data);
  }

  getLeaveTypes(): ApiResponse<LeaveType[]> {
    return this.getData("/");
  }

  updateLeaveType(id: number, data: UpdateLeaveTypeRequest): ApiResponse<LeaveType> {
    return this.putData(`/${id}`, data);
  }

  deleteLeaveType(id: number): ApiResponse<void> {
    return this.deleteData(`/${id}`);
  }
}

export default new LeaveTypeService();