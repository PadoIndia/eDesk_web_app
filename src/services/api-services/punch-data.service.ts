import { ApiResponse } from "../../types/axios.types";
import ApiService from "./api-service";
import { punchData, getPunchData, updatePunchData } from "../../types/punch-data.types";

class punchDataService extends ApiService {
  constructor() {
    super("/admin/punch-data");
  }

  createPunchData(data:punchData): ApiResponse{
    return this.postData("/", data);
  }

  getPunchDataById(userId:number,data:getPunchData): ApiResponse{
    return this.getData(`/${userId}/${data.month}/${data.year}`);
  }

  updatePunchData(userId:number, data: updatePunchData): ApiResponse{
    return this.putData(`/${userId}`,data);
  }

  deletePunchData(userId: number): ApiResponse{
    return this.deleteData(`/${userId}`);
  }

}

export default new punchDataService();