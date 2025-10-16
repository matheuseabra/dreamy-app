import { Router } from 'express';
import { authenticateUser, AuthRequest } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import supabaseAdmin from '../supabase/client';
import { updateVideoSchema, videoQuerySchema } from '../types/video-validation';
import { VideoStorageService } from '../services/video-storage-service';

const router = Router();
const videoStorageService = new VideoStorageService();

/**
 * GET /api/videos
 * List user's videos with pagination and filtering
 */
router.get('/', authenticateUser, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    // Validate and parse query parameters
    const queryValidation = videoQuerySchema.safeParse(req.query);
    if (!queryValidation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: queryValidation.error.message
      });
    }

    const { page, limit, favorites_only, sort_by, sort_order } = queryValidation.data;
    const offset = (page - 1) * limit;

    // Build query
    let query = supabaseAdmin
      .from('videos')
      .select('*, generations(prompt, model)', { count: 'exact' })
      .eq('user_id', userId);

    // Filter by favorites if requested
    if (favorites_only) {
      query = query.eq('is_favorited', true);
    }

    // Apply sorting
    query = query.order(sort_by, { ascending: sort_order === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: videos, error, count } = await query;

    if (error) {
      console.error('Failed to fetch videos:', error);
      throw error;
    }

    // Generate signed URLs for each video
    const videosWithUrls = await Promise.all(
      (videos || []).map(async (video) => ({
        id: video.id,
        url: await videoStorageService.getSignedUrl(video.storage_path, 3600),
        thumbnailUrl: video.thumbnail_path
          ? await videoStorageService.getSignedUrl(video.thumbnail_path, 3600)
          : null,
        width: video.width,
        height: video.height,
        duration_seconds: video.duration_seconds,
        format: video.format,
        fileSize: video.file_size_bytes,
        prompt: video.generations?.prompt,
        model: video.generations?.model,
        isFavorited: video.is_favorited,
        isPublic: video.is_public,
        createdAt: video.created_at,
      }))
    );

    res.json({
      success: true,
      videos: videosWithUrls,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error: any) {
    console.error('List videos error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch videos',
    });
  }
});

/**
 * GET /api/videos/:id
 * Get a single video by ID
 */
router.get('/:id', authenticateUser, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const videoId = req.params.id;

    const { data: video, error } = await supabaseAdmin
      .from('videos')
      .select('*, generations(prompt, model, negative_prompt, model_options, created_at)')
      .eq('id', videoId)
      .eq('user_id', userId)
      .single();

    if (error || !video) {
      return res.status(404).json({
        success: false,
        error: 'Video not found',
      });
    }

    // Generate signed URLs
    const url = await videoStorageService.getSignedUrl(video.storage_path, 3600);
    const thumbnailUrl = video.thumbnail_path
      ? await videoStorageService.getSignedUrl(video.thumbnail_path, 3600)
      : null;

    res.json({
      success: true,
      video: {
        id: video.id,
        url,
        thumbnailUrl,
        width: video.width,
        height: video.height,
        duration_seconds: video.duration_seconds,
        fps: video.fps,
        format: video.format,
        fileSize: video.file_size_bytes,
        isFavorited: video.is_favorited,
        isPublic: video.is_public,
        createdAt: video.created_at,
        generation: {
          prompt: video.generations?.prompt,
          negativePrompt: video.generations?.negative_prompt,
          model: video.generations?.model,
          modelOptions: video.generations?.model_options,
          createdAt: video.generations?.created_at,
        },
      },
    });
  } catch (error: any) {
    console.error('Get video error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch video',
    });
  }
});

/**
 * PATCH /api/videos/:id
 * Update video properties (favorite, public status)
 */
router.patch(
  '/:id',
  authenticateUser,
  validateBody(updateVideoSchema),
  async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const videoId = req.params.id;
      const updates = req.body;

      // Verify video exists and belongs to user
      const { data: existingVideo, error: fetchError } = await supabaseAdmin
        .from('videos')
        .select('id')
        .eq('id', videoId)
        .eq('user_id', userId)
        .single();

      if (fetchError || !existingVideo) {
        return res.status(404).json({
          success: false,
          error: 'Video not found',
        });
      }

      // Update video
      const { data: updatedVideo, error: updateError } = await supabaseAdmin
        .from('videos')
        .update(updates)
        .eq('id', videoId)
        .eq('user_id', userId)
        .select()
        .single();

      if (updateError) {
        console.error('Failed to update video:', updateError);
        throw updateError;
      }

      res.json({
        success: true,
        video: {
          id: updatedVideo.id,
          isFavorited: updatedVideo.is_favorited,
          isPublic: updatedVideo.is_public,
          updatedAt: updatedVideo.updated_at,
        },
      });
    } catch (error: any) {
      console.error('Update video error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to update video',
      });
    }
  }
);

/**
 * DELETE /api/videos/:id
 * Delete a video and its storage files
 */
router.delete('/:id', authenticateUser, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const videoId = req.params.id;

    // Get video to retrieve storage paths
    const { data: video, error: fetchError } = await supabaseAdmin
      .from('videos')
      .select('storage_path, thumbnail_path')
      .eq('id', videoId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !video) {
      return res.status(404).json({
        success: false,
        error: 'Video not found',
      });
    }

    // Delete from storage
    const pathsToDelete = [video.storage_path];
    if (video.thumbnail_path) {
      pathsToDelete.push(video.thumbnail_path);
    }

    await videoStorageService.deleteVideos(pathsToDelete);

    // Delete from database
    const { error: deleteError } = await supabaseAdmin
      .from('videos')
      .delete()
      .eq('id', videoId)
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Failed to delete video from database:', deleteError);
      throw deleteError;
    }

    res.json({
      success: true,
      message: 'Video deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete video error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete video',
    });
  }
});

/**
 * GET /api/videos/favorites
 * Get user's favorited videos
 */
router.get('/favorites/list', authenticateUser, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const { data: videos, error } = await supabaseAdmin
      .from('videos')
      .select('*, generations(prompt, model)')
      .eq('user_id', userId)
      .eq('is_favorited', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch favorite videos:', error);
      throw error;
    }

    const videosWithUrls = await Promise.all(
      (videos || []).map(async (video) => ({
        id: video.id,
        url: await videoStorageService.getSignedUrl(video.storage_path, 3600),
        thumbnailUrl: video.thumbnail_path
          ? await videoStorageService.getSignedUrl(video.thumbnail_path, 3600)
          : null,
        width: video.width,
        height: video.height,
        duration_seconds: video.duration_seconds,
        format: video.format,
        prompt: video.generations?.prompt,
        model: video.generations?.model,
        createdAt: video.created_at,
      }))
    );

    res.json({
      success: true,
      videos: videosWithUrls,
    });
  } catch (error: any) {
    console.error('Get favorite videos error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch favorite videos',
    });
  }
});

export default router;
