import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { BASE_URL } from "../../store/config";
import { ApiResponse } from "../../types/axios.types";

export const apiClient = axios.create({
  baseURL: BASE_URL,
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const user = localStorage.getItem("@user");
      if (user) {
        console.log(config.method, config.url);
        const decrypted = JSON.parse(atob(user));
        if (decrypted && decrypted.token) {
          config.headers.Authorization = "Bearer " + decrypted.token;
        }
      }
    } catch (error) {
      console.log(error, "??");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const data = response?.data;
    if (data.status === "error") {
      console.log("Request response rejected by backend :SUCCESS is false");
      return data;
    }
    return data;
  },
  (error: AxiosError) => {
    if (error.response) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, status } = error.response as any;
      console.log("Not authorized", error.config?.url);
      if (status === 401) {
        console.log("will sign out now................");
        localStorage.removeItem("@user");
        window.location.href = "/login";
      } else if (status === 404) {
        console.log("Resource Not found ", data);
      } else if (status === 500) {
        console.log(data);
        console.log("Some server error...don't know");
      }
      return Promise.resolve(error.response.data);
    } else if (error.request) {
      console.log("Network error!");
      console.log("Network error!", error);
    } else {
      console.log("Error in api-service " + error.message);
    }
    console.log("Error config:", error.config);

    return Promise.resolve(error);
  }
);

class ApiService {
  baseUrl = "";
  constructor(baseUrl: string) {
    if (!baseUrl.startsWith("http")) {
      baseUrl = `${BASE_URL}${baseUrl}`;
    }
    this.baseUrl = baseUrl;
  }

  getUrl(path: string | undefined) {
    if (!path?.startsWith("http")) {
      return `${this.baseUrl}${path}`;
    }
    return path;
  }

  getHeaders() {
    return {
      "Content-type": "application/json; charset=UTF-8",
    };
  }

  getData(path: string, options?: AxiosRequestConfig): ApiResponse {
    const headers = options?.headers || this.getHeaders();
    return apiClient.get(this.getUrl(path), { ...options, headers });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  postData(path: string, data: any, options?: AxiosRequestConfig): ApiResponse {
    const headers = options?.headers || this.getHeaders();

    return apiClient.post(this.getUrl(path), data, { ...options, headers });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  putData(path: string, data: any, options?: AxiosRequestConfig): ApiResponse {
    const headers = options?.headers || this.getHeaders();

    return apiClient.put(this.getUrl(path), data, { ...options, headers });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  patchData(path: string, data?: any, options?: AxiosRequestConfig): ApiResponse {
    const headers = options?.headers || this.getHeaders();

    return apiClient.patch(this.getUrl(path), data, { ...options, headers });
  }

  deleteData(
    path: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any,
    options?: AxiosRequestConfig
  ): ApiResponse {
    const headers = options?.headers || this.getHeaders();

    return apiClient.delete(this.getUrl(path), {
      data,
      ...options,
      headers,
    });
  }
}

export default ApiService;
