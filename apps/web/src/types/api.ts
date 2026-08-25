export interface Profile {
  id: number;
  username: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  profile?: Profile;
}

export interface ApiErrorPayload {
  message?: string;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data: T;
}
