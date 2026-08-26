import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from 'axios';

import type { ApiError, ApiErrorPayload, ApiErrorStatus } from '@/types/api';

class ApiService {
  private readonly api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
      timeout: 10000,
      withCredentials: true,
      headers: {
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

  async postMultipart<T>(
    url: string,
    data: FormData,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return (
      await this.api.post<T>(url, data, {
        ...config,
        headers: {
          ...config?.headers,
          'Content-Type': 'multipart/form-data',
        },
      })
    ).data;
  }

  async putMultipart<T>(
    url: string,
    data: FormData,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return (
      await this.api.put<T>(url, data, {
        ...config,
        headers: {
          ...config?.headers,
          'Content-Type': 'multipart/form-data',
        },
      })
    ).data;
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return (await this.api.patch<T>(url, data, config)).data;
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

const STATUS_MESSAGES: Record<ApiErrorStatus, string> = {
  401: 'Your session has expired. Log in to continue.',
  403: 'You do not have permission to make that change.',
  404: "We couldn't find what you requested.",
  409: 'That change conflicts with the current workspace data.',
  422: 'Check the highlighted fields and try again.',
  429: 'Too many requests. Wait a moment and try again.',
};

export const getApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const response = (error as AxiosError<ApiErrorPayload>).response;
    const status = response?.status;
    const mappedStatus = Object.keys(STATUS_MESSAGES).includes(String(status))
      ? (status as ApiErrorStatus)
      : undefined;
    const payload = response?.data;

    return {
      ...(payload ?? {}),
      status: mappedStatus,
      message:
        (mappedStatus && STATUS_MESSAGES[mappedStatus]) ??
        payload?.message ??
        'Something went wrong. Please try again.',
    };
  }
  return { message: 'Something went wrong. Please try again.' };
};
