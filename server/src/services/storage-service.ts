import { createError } from "../middleware/error-handler";
import supabaseAdmin from "../supabase/client";

export class StorageService {
  private bucket = 'generated-images';

  async uploadFromUrl(
    userId: string,
    generationId: string,
    imageId: string,
    imageUrl: string,
    index: number = 0
  ): Promise<string> {
    try {
      // Download image from fal URL
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      // Determine file extension from content-type
      const contentType = response.headers.get('content-type') || 'image/png';
      const extension = contentType.includes('jpeg') ? 'jpg' : 'png';

      // Create storage path
      const fileName = `${imageId}_${String(index).padStart(3, '0')}.${extension}`;
      const path = `${userId}/${generationId}/${fileName}`;

      // Upload to Supabase Storage
      const { error } = await supabaseAdmin.storage
        .from(this.bucket)
        .upload(path, buffer, {
          contentType,
          upsert: false,
        });

      if (error) throw error;

      return path;
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