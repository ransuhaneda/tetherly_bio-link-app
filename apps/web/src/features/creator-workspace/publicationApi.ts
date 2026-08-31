import { apiService } from '@/services/api';
import type {
  ApiMutationResponse,
  ApiResponse,
  CreatorProfile,
  PublicProfile,
} from '@/types/api';

export const publicationApi = {
  publish: async (): Promise<CreatorProfile> => {
    const response =
      await apiService.post<ApiMutationResponse<CreatorProfile>>(
        '/profile/publish'
      );
    return response.data;
  },

  unpublish: async (): Promise<CreatorProfile> => {
    const response =
      await apiService.post<ApiMutationResponse<CreatorProfile>>(
        '/profile/unpublish'
      );
    return response.data;
  },

  getPublic: async (username: string): Promise<PublicProfile> => {
    const response = await apiService.get<ApiResponse<PublicProfile>>(
      `/profiles/${encodeURIComponent(username.toLowerCase())}`
    );
    return response.data;
  },
};
