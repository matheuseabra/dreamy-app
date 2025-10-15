import { api } from '../api-client';

export interface PublicImage {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: {
    eTag: string;
    size: number;
    mimetype: string;
    cacheControl: string;
    lastModified: string;
    contentLength: number;
    httpStatusCode: number;
  };
  publicUrl: string;
}

interface PublicImagesResponse {
  success: boolean;
  objects: PublicImage[];
  total: number;
  error?: string;
}

export const imagesApi = {
  getPublicImages: () =>
    api.get<PublicImagesResponse>('/api/public-images'),
};
