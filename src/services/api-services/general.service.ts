import { AxiosProgressEvent } from "axios";
import { ApiResponse } from "../../types/axios.types";
import ApiService from "./api-service";

class GeneralService extends ApiService {
  constructor() {
    super("");
  }

  // uploadToS3(files:Files[]): ApiResponse<Files>{
  //     return this.postData('/uploads',files);
  // }
  // uploadToS3(
  //   file: File
  // ): ApiResponse {

  //   const hash = generateSHA256(file);

  //   const formData = new FormData();
  //   formData.append('files',file);
  //   formData.append('hashes',hash);

  //   return this.postData("/uploads", formData,{
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //   });
  // }

  uploadToS3(
    data: {
      image: File;
      hash: string;
    }[],
    onUploadProgress?: (pE: AxiosProgressEvent) => void
  ): ApiResponse<{ id: number; url: string }[]> {
    const formData = new FormData();

    data.forEach((d) => {
      formData.append("files", d.image);
      formData.append("hashes", d.hash);
    });

    return this.postData("", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    });
  }
}

export default new GeneralService();
