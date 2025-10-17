import { api } from '../api-client';

export interface GalleryImage {
  id: string;
  generation_id: string;
  user_id: string;
  storage_path: string;
  webp_path: string | null;
  url: string | null;
  width: number | null;
  height: number | null;
  content_type: string | null;
  file_size: number | null;
  is_favorited: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  prompt?: string;
  model?: string;
}

interface GalleryResponse {
  success: boolean;
  images: GalleryImage[];
  error?: string;
}

interface ToggleFavoriteResponse {
  success: boolean;
  image?: GalleryImage;
  error?: string;
}

interface DeleteImageResponse {
  success: boolean;
  error?: string;
}

interface PublishImageResponse {
  success: boolean;
  error?: string;
}

export const galleryApi = {
  getGallery: () =>
    api.get<GalleryResponse>('/api/gallery'),

  getFavorites: () =>
    api.get<GalleryResponse>('/api/gallery/test/favorites'),

  toggleFavorite: (imageId: string) =>
    api.post<ToggleFavoriteResponse>(`/api/gallery/${imageId}/favorite`),

  deleteImage: (imageId: string) =>
    api.delete<DeleteImageResponse>(`/api/gallery/${imageId}`),

  publishImage: (imageId: string) =>
    api.post<PublishImageResponse>(`/api/gallery/${imageId}/publish`),
};
