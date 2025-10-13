import { createError } from "../middleware/error-handler";
import supabaseAdmin from "../supabase/client";
import { ImageOptimizer } from "./image-optimizer";

export class StorageService {
  private bucket = 'generated-images';
  private imageOptimizer = new ImageOptimizer();

  async uploadFromUrl(
    userId: string,
    generationId: string,
    imageId: string,
    imageUrl: string,
    index: number = 0
  ): Promise<{ originalPath: string; webpPath: string; metadata: { width: number; height: number; size: number } }> {
    try {
      // Download image from fal URL
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const originalBuffer = Buffer.from(arrayBuffer);

      // Determine original file extension
      const contentType = response.headers.get('content-type') || 'image/png';
      const extension = contentType.includes('jpeg') ? 'jpg' : 'png';

      // Optimize to WebP
      const { webpBuffer, metadata } = await this.imageOptimizer.optimizeToWebP(originalBuffer);

      // Create storage paths
      const originalFileName = `${imageId}_${String(index).padStart(3, '0')}.${extension}`;
      const webpFileName = `${imageId}_${String(index).padStart(3, '0')}.webp`;
      const basePath = `${userId}/${generationId}`;
      const originalPath = `${basePath}/${originalFileName}`;
      const webpPath = `${basePath}/${webpFileName}`;

      // Upload both versions to Supabase Storage
      const [originalUpload, webpUpload] = await Promise.all([
        supabaseAdmin.storage.from(this.bucket).upload(originalPath, originalBuffer, {
          contentType,
          upsert: false,
        }),
        supabaseAdmin.storage.from(this.bucket).upload(webpPath, webpBuffer, {
          contentType: 'image/webp',
          upsert: false,
        }),
      ]);

      if (originalUpload.error) throw originalUpload.error;
      if (webpUpload.error) throw webpUpload.error;

      return { originalPath, webpPath, metadata };
    } catch (error: any) {
      console.error('Storage upload error:', error);
      throw createError(`Failed to upload image: ${error.message}`, 500);
    }
  }

  async getSignedUrl(path: string, expiresIn: number = 3600): Promise<string> {
    const { data, error } = await supabaseAdmin.storage
      .from(this.bucket)
      .createSignedUrl(path, expiresIn);

    if (error) throw createError('Failed to get signed URL', 500);
    return data.signedUrl;
  }

  async deleteImage(path: string): Promise<void> {
    const { error } = await supabaseAdmin.storage
      .from(this.bucket)
      .remove([path]);

    if (error) throw createError('Failed to delete image', 500);
  }
}