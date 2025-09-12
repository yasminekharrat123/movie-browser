import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface APIError {
  status?: number;
  message: string;
  data?: unknown;
}

export class BaseAxiosService {
  protected client: AxiosInstance;

  constructor(baseURL: string, defaultParams?: Record<string, unknown>) {
    this.client = axios.create({
      baseURL,
      params: defaultParams,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
  }

  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.get<T>(url, config);
      return response.data;
    } catch (err: unknown) {
      throw this.formatError(err);
    }
  }

  protected async post<T>(
    url: string,
    data?: AxiosRequestConfig['data'],
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.post<T>(url, data, config);
      return response.data;
    } catch (err: unknown) {
      throw this.formatError(err);
    }
  }

  private formatError(error: unknown): APIError {
    if (axios.isAxiosError(error)) {
      return {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      };
    }
    return { message: 'Unexpected error occurred' };
  }
}
