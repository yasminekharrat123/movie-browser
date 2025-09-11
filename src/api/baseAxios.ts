import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

export interface APIError {
  status?: number;
  message: string;
  data?: any;
}

export class BaseAxiosService {
  protected client: AxiosInstance;

  constructor(baseURL: string, defaultParams?: Record<string, any>) {
    this.client = axios.create({
      baseURL,
      params: defaultParams,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });
  }

  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.get<T>(url, config);
      return response.data;
    } catch (err: any) {
      throw this.formatError(err);
    }
  }

  protected async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return response.data;
    } catch (err: any) {
      throw this.formatError(err);
    }
  }

  private formatError(error: AxiosError): APIError {
    if (axios.isAxiosError(error)) {
      return {
        status: error.response?.status,
        message:  error.message,
        data: error.response?.data,
      };
    }
    return { message: "Unexpected error occurred" };
  }
}
