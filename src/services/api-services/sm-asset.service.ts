import { ApiResponse } from "../../types/axios.types";
import { SmAssetPayload, SmAssetResponse } from "../../types/sm-asset.types";
import ApiService from "./api-service";

class SmAssetService extends ApiService {
  constructor() {
    super("/sm-assets");
  }

  getAllAccounts(): ApiResponse<SmAssetResponse[]> {
    return this.getData("");
  }
  getAccountById(id: number): ApiResponse<SmAssetResponse> {
    return this.getData(`/${id}`);
  }
  createAccount(data: SmAssetPayload): ApiResponse<number> {
    return this.postData(``, data);
  }
  updateAccount(
    id: number,
    data: Partial<SmAssetPayload>
  ): ApiResponse<SmAssetResponse> {
    return this.putData(`/${id}`, data);
  }
  deleteAccount(id: number) {
    return this.deleteData(`/${id}`);
  }
}

export default new SmAssetService();
