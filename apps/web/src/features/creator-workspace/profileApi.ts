import { apiService } from '@/services/api';
import type {
  ApiMutationResponse,
  ApiResponse,
  CreatorProfile,
  ProfileUpdateInput,
} from '@/types/api';

export const profileApi = {
  get: async (): Promise<CreatorProfile> => {
    const response =
      await apiService.get<ApiResponse<CreatorProfile>>('/profile');
    return response.data;
  },

  update: async (input: ProfileUpdateInput): Promise<CreatorProfile> => {
    const response = await apiService.patch<
      ApiMutationResponse<CreatorProfile>
    >('/profile', input);
    return response.data;
  },

  uploadAvatar: async (file: File): Promise<CreatorProfile> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await apiService.putMultipart<
      ApiMutationResponse<CreatorProfile>
    >('/profile/avatar', formData);
    return response.data;
  },

  deleteAvatar: async (): Promise<CreatorProfile> => {
    const response =
      await apiService.delete<ApiMutationResponse<CreatorProfile>>(
        '/profile/avatar'
      );
    return response.data;
  },
};
