import { useQuery } from '@tanstack/react-query';
import { imagesApi } from '@/lib/api/images';

export const imageKeys = {
  all: ['images'] as const,
  public: () => [...imageKeys.all, 'public'] as const,
};

export function usePublicImages() {
  return useQuery({
    queryKey: imageKeys.public(),
    queryFn: async () => {
      const response = await imagesApi.getPublicImages();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch public images');
      }
      return {
        objects: response.objects,
        total: response.total,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
