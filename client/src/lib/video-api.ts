import { api } from './api-client';

/**
 * Video API Client
 * Handles all video generation and management API calls
 */

export interface GenerateVideoParams {
  model: string;
  prompt: string;
  negative_prompt?: string;
  image_size?: string;
  aspect_ratio?: string;
  duration_seconds?: number;
  fps?: number;
  seed?: number;
  guidance_scale?: number;
  num_inference_steps?: number;
  enable_safety_checker?: boolean;
  sync_mode?: boolean;
  model_options?: Record<string, unknown>;
}

export interface Video {
  id: string;
  url: string;
  thumbnailUrl?: string | null;
  width?: number;
  height?: number;
  duration_seconds?: number;
  fps?: number;
  format?: string;
  fileSize?: number;
  aspectRatio?: string;
  isFavorited?: boolean;
  isPublic?: boolean;
  createdAt?: string;
  prompt?: string;
  model?: string;
}

export interface VideoGeneration {
  id: string;
  status: 'pending' | 'in_queue' | 'processing' | 'completed' | 'failed';
  queuePosition?: number;
  prompt?: string;
  model?: string;
  error?: string;
  video?: Video;
  falRequestId?: string;
  message?: string;
  createdAt?: string;
  completedAt?: string;
}

export interface VideoListResponse {
  success: boolean;
  videos: Video[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

export interface VideoResponse {
  success: boolean;
  video?: Video;
  error?: string;
}

export interface GenerateVideoResponse {
  success: boolean;
  generation?: VideoGeneration;
  error?: string;
  details?: string;
}

export interface UpdateVideoParams {
  is_favorited?: boolean;
  is_public?: boolean;
}

/**
 * Generate a video using AI text-to-video models
 */
export async function generateVideo(params: GenerateVideoParams): Promise<GenerateVideoResponse> {
  return api.post<GenerateVideoResponse>('/api/generate-video', params);
}

/**
 * Get video generation status
 */
export async function getVideoGenerationStatus(generationId: string): Promise<GenerateVideoResponse> {
  return api.get<GenerateVideoResponse>(`/api/generate-video/${generationId}`);
}

/**
 * Cancel a queued or processing video generation
 */
export async function cancelVideoGeneration(generationId: string): Promise<{ success: boolean; message?: string; error?: string }> {
  return api.delete(`/api/generate-video/${generationId}`);
}

/**
 * List user's videos with pagination and filtering
 */
export async function listVideos(params?: {
  page?: number;
  limit?: number;
  favorites_only?: boolean;
  sort_by?: 'created_at' | 'duration_seconds';
  sort_order?: 'asc' | 'desc';
}): Promise<VideoListResponse> {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.set('page', params.page.toString());
  if (params?.limit) queryParams.set('limit', params.limit.toString());
  if (params?.favorites_only) queryParams.set('favorites_only', 'true');
  if (params?.sort_by) queryParams.set('sort_by', params.sort_by);
  if (params?.sort_order) queryParams.set('sort_order', params.sort_order);

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/api/videos?${queryString}` : '/api/videos';

  return api.get<VideoListResponse>(endpoint);
}

/**
 * Get a single video by ID
 */
export async function getVideo(videoId: string): Promise<VideoResponse> {
  return api.get<VideoResponse>(`/api/videos/${videoId}`);
}

/**
 * Update video properties (favorite, public status)
 */
export async function updateVideo(videoId: string, updates: UpdateVideoParams): Promise<VideoResponse> {
  return api.patch<VideoResponse>(`/api/videos/${videoId}`, updates);
}

/**
 * Delete a video
 */
export async function deleteVideo(videoId: string): Promise<{ success: boolean; message?: string; error?: string }> {
  return api.delete(`/api/videos/${videoId}`);
}

/**
 * Get user's favorited videos
 */
export async function getFavoriteVideos(): Promise<VideoListResponse> {
  return api.get<VideoListResponse>('/api/videos/favorites/list');
}

/**
 * Toggle video favorite status
 */
export async function toggleVideoFavorite(videoId: string, isFavorited: boolean): Promise<VideoResponse> {
  return updateVideo(videoId, { is_favorited: isFavorited });
}

/**
 * Publish video (make public)
 */
export async function publishVideo(videoId: string): Promise<VideoResponse> {
  return updateVideo(videoId, { is_public: true });
}

/**
 * Unpublish video (make private)
 */
export async function unpublishVideo(videoId: string): Promise<VideoResponse> {
  return updateVideo(videoId, { is_public: false });
}
