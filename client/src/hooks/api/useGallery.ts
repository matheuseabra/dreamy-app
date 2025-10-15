import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { galleryApi, GalleryImage } from '@/lib/api/gallery';

// Query keys
export const galleryKeys = {
  all: ['gallery'] as const,
  list: () => [...galleryKeys.all, 'list'] as const,
};

// Hooks
export function useGallery() {
  return useQuery({
    queryKey: galleryKeys.list(),
    queryFn: async () => {
      const response = await galleryApi.getGallery();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch gallery');
      }
      return response.images;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId: string) => galleryApi.toggleFavorite(imageId),
    onMutate: async (imageId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: galleryKeys.list() });

      // Snapshot previous value
      const previousImages = queryClient.getQueryData<GalleryImage[]>(galleryKeys.list());

      // Optimistically update
      if (previousImages) {
        queryClient.setQueryData<GalleryImage[]>(
          galleryKeys.list(),
          previousImages.map((img) =>
            img.id === imageId ? { ...img, is_favorited: !img.is_favorited } : img
          )
        );
      }

      return { previousImages };
    },
    onError: (err, imageId, context) => {
      // Rollback on error
      if (context?.previousImages) {
        queryClient.setQueryData(galleryKeys.list(), context.previousImages);
      }
    },
    onSuccess: (response) => {
      if (response.success) {
        // Refetch to ensure consistency
        queryClient.invalidateQueries({ queryKey: galleryKeys.list() });
      }
    },
  });
}

export function useDeleteImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId: string) => galleryApi.deleteImage(imageId),
    onMutate: async (imageId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: galleryKeys.list() });

      // Snapshot previous value
      const previousImages = queryClient.getQueryData<GalleryImage[]>(galleryKeys.list());

      // Optimistically remove the image
      if (previousImages) {
        queryClient.setQueryData<GalleryImage[]>(
          galleryKeys.list(),
          previousImages.filter((img) => img.id !== imageId)
        );
      }

      return { previousImages };
    },
    onError: (err, imageId, context) => {
      // Rollback on error
      if (context?.previousImages) {
        queryClient.setQueryData(galleryKeys.list(), context.previousImages);
      }
    },
    onSuccess: (response) => {
      if (response.success) {
        // Already updated optimistically, just ensure consistency
        queryClient.invalidateQueries({ queryKey: galleryKeys.list() });
      }
    },
  });
}

export function usePublishImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId: string) => galleryApi.publishImage(imageId),
    onSuccess: (response, imageId) => {
      if (response.success) {
        // Update the image in the cache
        const previousImages = queryClient.getQueryData<GalleryImage[]>(galleryKeys.list());
        if (previousImages) {
          queryClient.setQueryData<GalleryImage[]>(
            galleryKeys.list(),
            previousImages.map((img) =>
              img.id === imageId ? { ...img, is_public: true } : img
            )
          );
        }

        // Invalidate to ensure consistency
        queryClient.invalidateQueries({ queryKey: galleryKeys.list() });
      }
    },
  });
}
