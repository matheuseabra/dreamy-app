import { config } from '@/config';
import { api } from './api-client';

/**
 * @deprecated Use hooks from @/hooks/api instead
 * This file is kept for backward compatibility only
 */

// Re-export types for backward compatibility
export interface Profile {
  id: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * @deprecated Use apiClient from './api-client' instead
 */
export const apiClient = {
  get: api.get,
  post: api.post,
  put: api.put,
  patch: api.patch,
  delete: api.delete,
};

/**
 * @deprecated Use useProfile hook from @/hooks/api/useAuth instead
 */
export async function getProfile(id: string): Promise<Profile | null> {
  const res = await api.get<{ success: boolean; user?: Profile; error?: string }>(`/api/auth/profile/${id}`);
  if (res.success && res.user) return res.user;
  return null;
}

/**
 * @deprecated Use useMyProfile hook from @/hooks/api/useAuth instead
 */
export async function getMyProfile(): Promise<Profile | null> {
  const res = await api.get<{ success: boolean; user?: Profile; error?: string }>(`/api/auth/me`);
  if (res.success && res.user) return res.user;
  return null;
}

/**
 * @deprecated Use useUpdateProfile hook from @/hooks/api/useAuth instead
 */
export async function updateMyProfile(data: Partial<Pick<Profile, 'full_name' | 'avatar_url'>>): Promise<Profile | null> {
  const res = await api.patch<{ success: boolean; user?: Profile; error?: string }>(`/api/auth/me`, data);
  if (res.success && res.user) return res.user;
  return null;
}

/**
 * @deprecated Use usePublicImages hook from @/hooks/api/useImages instead
 */
export const fetchPublicImages = async () => {
  const response = await fetch(`${config.API_URL}/api/public-images`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * @deprecated Use useCreateCheckoutSession hook from @/hooks/api/useBilling instead
 */
export async function createCheckoutSession(packId: string): Promise<{ url: string }> {
  const response = await api.post<{ success: boolean; data: { url: string }; error?: string }>(
    '/api/billing/create-checkout-session',
    { packId }
  );

  if (!response.success) {
    throw new Error(response.error || 'Failed to create checkout session');
  }

  return response.data;
}
