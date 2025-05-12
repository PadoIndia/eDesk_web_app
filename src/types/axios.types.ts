/* eslint-disable @typescript-eslint/no-explicit-any */
interface ApiResp<T = any> {
  data: T;
  status: "success" | "failure" | "error";
  message: string;
  errors?: any;
  meta: {
    total: number;
    page?: number;
    limit?: number;
  };
  errorCode: number;
}

export type ApiResponse<T = any> = Promise<ApiResp<T>>;
