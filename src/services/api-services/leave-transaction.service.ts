// services/api-services/leave-transaction.service.ts
import { ApiResponse } from "../../types/axios.types";
import ApiService from "./api-service";
import { 
  CreateLeaveTransactionRequest, 
  UpdateLeaveTransactionRequest,
  LeaveTransactionFilters,
} from '../../types/leave.types';

class LeaveTransactionService extends ApiService {
  constructor() {
    super("/admin/leave-transaction");
  }
  
  // GET /api/leave-transactions - Get leave transactions with filters
  getLeaveTransactions(params?: LeaveTransactionFilters): ApiResponse {
    return this.getData("/", { params });
  }

  // POST /api/leave-transactions - Create a new leave transaction
  createLeaveTransaction(data: CreateLeaveTransactionRequest): ApiResponse {
    return this.postData("/", data);
  }

  // GET /api/leave-transactions/:transactionId - Get leave transaction by ID
  getLeaveTransactionById(transactionId: number): ApiResponse {
    return this.getData(`/${transactionId}`);
  }

  // PUT /api/leave-transactions/:transactionId - Update leave transaction
  updateLeaveTransaction(transactionId: number, data: UpdateLeaveTransactionRequest): ApiResponse {
    return this.putData(`/${transactionId}`, data);
  }

  // DELETE /api/leave-transactions/:transactionId - Delete leave transaction
  deleteLeaveTransaction(transactionId: number): ApiResponse {
    return this.deleteData(`/${transactionId}`);
  }

  // GET /api/leave-transactions/user/:userId - Get leave transactions by user
  getLeaveTransactionsByUser(userId: number, params?: LeaveTransactionFilters): ApiResponse {
    return this.getData(`/user/${userId}`, { params });
  }

  // GET /api/leave-transactions/user/:userId/balance - Get leave balance for user
  getLeaveBalance(userId: number): ApiResponse {
    return this.getData(`/user/${userId}/balance`);
  }

  // GET /api/leave-transactions/user/:userId/:leaveId/balance - Get leave balance by type for user
  getLeaveBalanceByType(userId: number, leaveId: number): ApiResponse {
    return this.getData(`/user/${userId}/${leaveId}/balance`);
  }
}

export default new LeaveTransactionService();