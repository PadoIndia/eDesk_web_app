import { AxiosProgressEvent } from "axios";
import { ApiResponse } from "../../types/axios.types";
import ApiService from "./api-service";

class GeneralService extends ApiService {
  constructor() {
    super("");
  }

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
