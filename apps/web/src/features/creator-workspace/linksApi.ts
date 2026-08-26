import { apiService } from '@/services/api';
import type {
  ApiDeleteResponse,
  ApiMutationResponse,
  ApiResponse,
  CreatorLink,
  LinkInput,
  LinkReorderInput,
} from '@/types/api';

const linksPath = '/profile/links';

export const linksApi = {
  list: async (): Promise<CreatorLink[]> => {
    const response =
      await apiService.get<ApiResponse<CreatorLink[]>>(linksPath);
    return response.data;
  },

  create: async (input: LinkInput): Promise<CreatorLink> => {
    const response = await apiService.post<ApiMutationResponse<CreatorLink>>(
      linksPath,
      input
    );
    return response.data;
  },

  get: async (id: number): Promise<CreatorLink> => {
    const response = await apiService.get<ApiResponse<CreatorLink>>(
      `${linksPath}/${id}`
    );
    return response.data;
  },

  update: async (
    id: number,
    input: Partial<LinkInput>
  ): Promise<CreatorLink> => {
    const response = await apiService.patch<ApiMutationResponse<CreatorLink>>(
      `${linksPath}/${id}`,
      input
    );
    return response.data;
  },

  remove: async (id: number): Promise<null> => {
    const response = await apiService.delete<ApiDeleteResponse>(
      `${linksPath}/${id}`
    );
    return response.data;
  },

  reorder: async (input: LinkReorderInput): Promise<CreatorLink[]> => {
    const response = await apiService.put<ApiMutationResponse<CreatorLink[]>>(
      `${linksPath}/order`,
      input
    );
    return response.data;
  },
};
