import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, Profile } from '@/lib/api/auth';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  profile: (id: string) => [...authKeys.all, 'profile', id] as const,
  myProfile: () => [...authKeys.all, 'my-profile'] as const,
};

// Hooks
export function useProfile(id: string) {
  return useQuery({
    queryKey: authKeys.profile(id),
    queryFn: async () => {
      const response = await authApi.getProfile(id);
      if (!response.success || !response.user) {
        throw new Error(response.error || 'Profile not found');
      }
      return response.user;
    },
    enabled: !!id,
  });
}

export function useMyProfile() {
  return useQuery({
    queryKey: authKeys.myProfile(),
    queryFn: async () => {
      const response = await authApi.getMyProfile();
      if (!response.success || !response.user) {
        throw new Error(response.error || 'Profile not found');
      }
      return response.user;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.updateMyProfile,
    onSuccess: (response) => {
      if (response.success && response.user) {
        // Update the cache with the new profile data
        queryClient.setQueryData(authKeys.myProfile(), response.user);
      }
    },
  });
}
