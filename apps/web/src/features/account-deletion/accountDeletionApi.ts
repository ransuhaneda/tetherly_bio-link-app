import { apiService } from '@/services/api';
import type { AccountDeletion, ApiMutationResponse } from '@/types/api';

export const accountDeletionApi = {
  async request(currentPassword: string): Promise<AccountDeletion> {
    const response = await apiService.post<
      ApiMutationResponse<AccountDeletion>
    >('/account/deletion', { current_password: currentPassword });

    return response.data;
  },
};
