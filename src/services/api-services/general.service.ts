import { ApiResponse } from "../../types/axios.types";
import ApiService from "./api-service";

class GeneralService extends ApiService {
  constructor() {
    super("");
  }

  // uploadToS3(files:Files[]): ApiResponse<Files>{
  //     return this.postData('/uploads',files);
  // }
  uploadToS3(
    file: File
  ): ApiResponse {

    const formData = new FormData();
    formData.append('files',file);

    
    return this.postData("/uploads", formData,{
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export default new GeneralService();
