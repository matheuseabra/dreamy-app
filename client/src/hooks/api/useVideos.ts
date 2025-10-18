import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listVideos,
  getVideo,
  updateVideo,
  deleteVideo,
  toggleVideoFavorite,
  getFavoriteVideos,
  type VideoListResponse,
  type VideoResponse,
  type UpdateVideoParams
} from '@/lib/video-api';

// Query keys for video-related queries
export const videoKeys = {
  all: ['videos'] as const,
  lists: () => [...videoKeys.all, 'list'] as const,
  // Normalize filters into a stable JSON string so the query key is stable
  // (avoid passing raw objects which change identity on each render).
  list: (filters?: Record<string, any>) => {
    const normalized = filters
      ? JSON.stringify(
          Object.keys(filters)
            .sort()
            .reduce((acc, key) => {
              (acc as Record<string, any>)[key] = (filters as Record<string, any>)[key];
              return acc;
            }, {} as Record<string, any>)
        )
      : '{}';
    return [...videoKeys.lists(), normalized] as const;
  },
  details: () => [...videoKeys.all, 'detail'] as const,
  detail: (id: string) => [...videoKeys.details(), id] as const,
  favorites: () => [...videoKeys.all, 'favorites'] as const,
};

/**
 * Hook to fetch user's video list
 */
export function useVideos(params?: {
  page?: number;
  limit?: number;
  favorites_only?: boolean;
  sort_by?: 'created_at' | 'duration_seconds';
  sort_order?: 'asc' | 'desc';
}) {
  return useQuery({
    queryKey: videoKeys.list(params),
    queryFn: async () => {
      const response = await listVideos(params);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch videos');
      }
      return response;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to fetch a single video by ID
 */
export function useVideo(videoId: string) {
  return useQuery({
    queryKey: videoKeys.detail(videoId),
    queryFn: async () => {
      const response = await getVideo(videoId);
      if (!response.success || !response.video) {
        throw new Error(response.error || 'Failed to fetch video');
      }
      return response.video;
    },
    enabled: !!videoId,
  });
}

/**
 * Hook to fetch favorite videos
 */
export function useFavoriteVideos() {
  return useQuery({
    queryKey: videoKeys.favorites(),
    queryFn: async () => {
      const response = await getFavoriteVideos();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch favorite videos');
      }
      return response.videos;
    },
  });
}

/**
 * Hook to update video properties
 */
export function useUpdateVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ videoId, updates }: { videoId: string; updates: UpdateVideoParams }) =>
      updateVideo(videoId, updates),
    onSuccess: (data, variables) => {
      // Invalidate and refetch video lists
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
      // Update the specific video in cache
      queryClient.invalidateQueries({ queryKey: videoKeys.detail(variables.videoId) });
      // Invalidate favorites if favorite status changed
      if (variables.updates.is_favorited !== undefined) {
        queryClient.invalidateQueries({ queryKey: videoKeys.favorites() });
      }
    },
  });
}

/**
 * Hook to toggle video favorite status
 */
export function useToggleVideoFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ videoId, isFavorited }: { videoId: string; isFavorited: boolean }) =>
      toggleVideoFavorite(videoId, isFavorited),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
      queryClient.invalidateQueries({ queryKey: videoKeys.detail(variables.videoId) });
      queryClient.invalidateQueries({ queryKey: videoKeys.favorites() });
    },
  });
}

/**
 * Hook to delete a video
 */
export function useDeleteVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (videoId: string) => deleteVideo(videoId),
    onSuccess: (data, videoId) => {
      // Invalidate video lists
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
      // Remove the specific video from cache
      queryClient.removeQueries({ queryKey: videoKeys.detail(videoId) });
      // Invalidate favorites
      queryClient.invalidateQueries({ queryKey: videoKeys.favorites() });
    },
  });
}
