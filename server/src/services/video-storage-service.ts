import { createError } from '../middleware/error-handler';
import supabaseAdmin from '../supabase/client';

/**
 * Video Storage Service
 *
 * Handles video file upload, storage, and URL generation for Supabase Storage.
 * Separate from image storage to keep concerns isolated.
 */
export class VideoStorageService {
  private bucket = 'generated-videos';

  /**
   * Upload video from a remote URL to Supabase storage
   * @param userId - User ID owning the video
   * @param generationId - Generation ID this video belongs to
   * @param videoId - Unique video ID
   * @param videoUrl - Remote URL to download video from (Fal.ai URL)
   * @param index - Index for multiple videos (default 0)
   * @returns Storage path and metadata
   */
  async uploadFromUrl(
    userId: string,
    generationId: string,
    videoId: string,
    videoUrl: string,
    index: number = 0
  ): Promise<{
    originalPath: string;
    thumbnailPath?: string;
    metadata: {
      size?: number;
      width?: number;
      height?: number;
      duration?: number;
      contentType?: string;
    };
  }> {
    try {
      console.log(`Downloading video from: ${videoUrl}`);

      // Download video from Fal URL
      const response = await fetch(videoUrl);
      if (!response.ok) {
        throw new Error(`Failed to download video: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Determine content type and file extension
      const contentType = response.headers.get('content-type') || 'video/mp4';
      const extension = this.getExtensionFromContentType(contentType);

      // Create storage path structure: userId/generationId/videoId_index.ext
      const basePath = `${userId}/${generationId}`;
      const fileName = index > 0
        ? `${videoId}_${String(index).padStart(3, '0')}.${extension}`
        : `${videoId}.${extension}`;
      const originalPath = `${basePath}/${fileName}`;

      console.log(`Uploading video to storage: ${originalPath}`);

      // Upload to Supabase Storage
      const { error: uploadError } = await supabaseAdmin.storage
        .from(this.bucket)
        .upload(originalPath, buffer, {
          contentType,
          upsert: false,
          cacheControl: '3600', // Cache for 1 hour
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }

      console.log(`Video uploaded successfully: ${originalPath}`);

      // Return metadata
      return {
        originalPath,
        metadata: {
          size: buffer.length,
          contentType,
          // width, height, duration would need video processing library (ffmpeg)
          // For now, rely on Fal metadata in webhook payload
        },
      };
    } catch (error: any) {
      console.error('Video upload error:', error);
      throw createError(`Failed to upload video: ${error.message}`, 500);
    }
  }

  /**
   * Get signed URL for a video
   * Videos are stored in a private bucket, so we need signed URLs
   * @param path - Storage path of the video
   * @param expiresIn - Expiration time in seconds (default 1 hour)
   * @returns Signed URL
   */
  async getSignedUrl(path: string, expiresIn: number = 3600): Promise<string> {
    try {
      const { data, error } = await supabaseAdmin.storage
        .from(this.bucket)
        .createSignedUrl(path, expiresIn);

      if (error) {
        console.error('Failed to create signed URL:', error);
        throw error;
      }

      return data.signedUrl;
    } catch (error: any) {
      console.error('Get signed URL error:', error);
      throw createError('Failed to get video signed URL', 500);
    }
  }

  /**
   * Get public URL for a video (if bucket is public)
   * Note: Currently using private bucket, so this won't work without changing bucket policy
   * @param path - Storage path of the video
   * @returns Public URL
   */
  getPublicUrl(path: string): string {
    const { data } = supabaseAdmin.storage
      .from(this.bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  /**
   * Delete video from storage
   * @param path - Storage path of the video
   */
  async deleteVideo(path: string): Promise<void> {
    try {
      const { error } = await supabaseAdmin.storage
        .from(this.bucket)
        .remove([path]);

      if (error) {
        console.error('Failed to delete video:', error);
        throw error;
      }

      console.log(`Video deleted successfully: ${path}`);
    } catch (error: any) {
      console.error('Delete video error:', error);
      throw createError('Failed to delete video', 500);
    }
  }

  /**
   * Delete multiple videos from storage
   * @param paths - Array of storage paths
   */
  async deleteVideos(paths: string[]): Promise<void> {
    try {
      const { error } = await supabaseAdmin.storage
        .from(this.bucket)
        .remove(paths);

      if (error) {
        console.error('Failed to delete videos:', error);
        throw error;
      }

      console.log(`${paths.length} videos deleted successfully`);
    } catch (error: any) {
      console.error('Delete videos error:', error);
      throw createError('Failed to delete videos', 500);
    }
  }

  /**
   * Helper: Get file extension from content type
   * @param contentType - MIME type
   * @returns File extension
   */
  private getExtensionFromContentType(contentType: string): string {
    if (contentType.includes('webm')) return 'webm';
    if (contentType.includes('mp4')) return 'mp4';
    if (contentType.includes('quicktime')) return 'mov';
    if (contentType.includes('x-msvideo')) return 'avi';

    // Default to mp4
    return 'mp4';
  }

  /**
   * Move video to public bucket (for publishing feature)
   * @param sourcePath - Source path in private bucket
   * @param userId - User ID
   * @param videoId - Video ID
   * @returns New path in public bucket
   */
  async moveToPublicBucket(
    sourcePath: string,
    userId: string,
    videoId: string
  ): Promise<string> {
    try {
      // Download from private bucket
      const { data: downloadData, error: downloadError } = await supabaseAdmin.storage
        .from(this.bucket)
        .download(sourcePath);

      if (downloadError) throw downloadError;

      // Upload to public bucket
      const publicBucket = 'public-videos';
      const publicPath = `${userId}/${videoId}`;

      const buffer = Buffer.from(await downloadData.arrayBuffer());

      const { error: uploadError } = await supabaseAdmin.storage
        .from(publicBucket)
        .upload(publicPath, buffer, {
          contentType: downloadData.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      return publicPath;
    } catch (error: any) {
      console.error('Move to public bucket error:', error);
      throw createError('Failed to publish video', 500);
    }
  }
}
