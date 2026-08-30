export interface Profile {
  id: number;
  username: string;
}

export const CREATOR_PROFILE_THEME = 'editorial-bento' as const;

export type CreatorProfileTheme = typeof CREATOR_PROFILE_THEME;

export interface CreatorProfile {
  id: number;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  theme: CreatorProfileTheme;
  publication_state: 'draft' | 'published';
  publication_status?: 'draft' | 'published' | 'changes_not_published';
  draft_revision?: number;
  publication_revision?: number | null;
  published_at: string | null;
  published_version: number | null;
  has_published?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatorLink {
  id: number;
  label: string;
  url: string;
  icon: string | null;
  category: string | null;
  position: number;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface PublicProfile {
  username: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  theme: CreatorProfileTheme;
  version: number;
  published_at: string;
  links: Array<Omit<CreatorLink, 'enabled' | 'created_at' | 'updated_at'>>;
}

export interface ProfileUpdateInput {
  username?: string;
  display_name?: string | null;
  bio?: string | null;
  theme?: CreatorProfileTheme;
}

export interface LinkInput {
  label: string;
  url: string;
  icon?: string | null;
  category?: string | null;
  enabled?: boolean;
}

export interface LinkReorderInput {
  ordered_link_ids: number[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  profile: Profile;
}

export type AccountDeletionState =
  | 'pending'
  | 'restored'
  | 'purge_eligible'
  | 'purging'
  | 'completed'
  | 'failed';

export interface AccountDeletion {
  state: AccountDeletionState;
  requested_at: string;
  recovery_deadline: string;
  deletion_date: string;
  username: string;
}

export interface AuthenticatedLoginResult {
  status: 'authenticated';
  user: User;
}

export interface RestorationRequiredLoginResult {
  status: 'restoration_required';
  deletion: AccountDeletion;
}

export type LoginResult =
  | AuthenticatedLoginResult
  | RestorationRequiredLoginResult;

export interface ApiErrorPayload {
  message?: string;
  errors?: Record<string, string[]>;
  retry_after?: number;
}

export type ApiErrorStatus = 401 | 403 | 404 | 409 | 422 | 429;

export interface ApiError extends ApiErrorPayload {
  message: string;
  status?: ApiErrorStatus;
}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiMutationResponse<T> extends ApiResponse<T> {
  message: string;
}

export type ApiDeleteResponse = ApiMutationResponse<null>;
