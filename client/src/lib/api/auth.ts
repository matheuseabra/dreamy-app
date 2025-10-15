import { api } from '../api-client';

export interface Profile {
  id: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface ProfileResponse {
  success: boolean;
  user?: Profile;
  error?: string;
}

export const authApi = {
  getProfile: (id: string) =>
    api.get<ProfileResponse>(`/api/auth/profile/${id}`),

  getMyProfile: () =>
    api.get<ProfileResponse>(`/api/auth/me`),

  updateMyProfile: (data: Partial<Pick<Profile, 'full_name' | 'avatar_url'>>) =>
    api.patch<ProfileResponse>(`/api/auth/me`, data),
};
