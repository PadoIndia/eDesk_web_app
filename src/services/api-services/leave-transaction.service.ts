import { ApiResponse } from "../../types/axios.types";
import ApiService from "./api-service";
import {
  CreateLeaveTransactionRequest,
  UpdateLeaveTransactionRequest,
  LeaveTransactionFilters,
  LeaveTransactionResponse,
} from "../../types/leave.types";

class LeaveTransactionService extends ApiService {
  constructor() {
    super("/admin/leave-transaction");
  }

  getLeaveTransactions(
    params?: LeaveTransactionFilters
  ): ApiResponse<LeaveTransactionResponse[]> {
    return this.getData("/", { params });
  }

  createLeaveTransaction(
    data: CreateLeaveTransactionRequest
  ): ApiResponse<number> {
    return this.postData("/", data);
  }

  getLeaveTransactionById(
    transactionId: number
  ): ApiResponse<LeaveTransactionResponse> {
    return this.getData(`/${transactionId}`);
  }

  updateLeaveTransaction(
    transactionId: number,
    data: UpdateLeaveTransactionRequest
  ): ApiResponse<LeaveTransactionResponse> {
    return this.putData(`/${transactionId}`, data);
  }

  deleteLeaveTransaction(transactionId: number): ApiResponse {
    return this.deleteData(`/${transactionId}`);
  }

  getLeaveTransactionsByUser(userId: number, params?: LeaveTransactionFilters) {
    return this.getLeaveTransactions({ userId, ...params });
  }
}

export default new LeaveTransactionService();
