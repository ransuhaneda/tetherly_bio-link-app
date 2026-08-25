import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from 'axios';

import type { ApiErrorPayload } from '@/types/api';

class ApiService {
  private readonly api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
      timeout: 10000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }

  async csrf(): Promise<void> {
    await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return (await this.api.get<T>(url, config)).data;
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return (await this.api.post<T>(url, data, config)).data;
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return (await this.api.put<T>(url, data, config)).data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return (await this.api.delete<T>(url, config)).data;
  }
}

export const apiService = new ApiService();

export const getApiError = (error: unknown): ApiErrorPayload => {
  if (axios.isAxiosError(error)) {
    return (
      (error as AxiosError<ApiErrorPayload>).response?.data ?? {
        message: 'Something went wrong.',
      }
    );
  }
  return { message: 'Something went wrong. Please try again.' };
};
