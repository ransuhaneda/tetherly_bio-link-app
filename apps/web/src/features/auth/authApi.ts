import { apiService } from '@/services/api';
import type {
  ApiMutationResponse,
  ApiResponse,
  AuthenticatedLoginResult,
  LoginResult,
  RestorationRequiredLoginResult,
  User,
} from '@/types/api';

export interface RegisterInput {
  name: string;
  email: string;
  username: string;
  password: string;
  password_confirmation: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export const authApi = {
  async register(input: RegisterInput): Promise<User> {
    await apiService.csrf();
    const response = await apiService.post<ApiResponse<User>>(
      '/auth/register',
      input
    );
    return response.data;
  },
  async login(input: LoginInput): Promise<LoginResult> {
    await apiService.csrf();
    const response = await apiService.post<ApiResponse<LoginResult>>(
      '/auth/login',
      input
    );
    return response.data;
  },
  async recovery(): Promise<RestorationRequiredLoginResult> {
    const response =
      await apiService.get<ApiResponse<RestorationRequiredLoginResult>>(
        '/auth/recovery'
      );
    return response.data;
  },
  async restore(): Promise<AuthenticatedLoginResult> {
    const response =
      await apiService.post<ApiMutationResponse<AuthenticatedLoginResult>>(
        '/auth/restore'
      );
    return response.data;
  },
  async me(): Promise<User> {
    const response = await apiService.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },
  async logout(): Promise<void> {
    await apiService.post('/auth/logout');
  },
  async usernameAvailability(username: string): Promise<boolean> {
    const response = await apiService.get<
      ApiResponse<{ username: string; available: boolean }>
    >(`/usernames/${encodeURIComponent(username)}/availability`);
    return response.data.available;
  },
};
