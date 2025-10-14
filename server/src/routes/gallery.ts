import { Router } from 'express';

import { authenticateUser, AuthRequest } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validate';

import { StorageService } from '../services/storage-service';
import supabaseAdmin from '../supabase/client';
import { paginationSchema, updateImageSchema } from '../types/validation';

const router = Router();
const storageService = new StorageService();

router.get(
  '/',
  authenticateUser,
  validateQuery(paginationSchema),
  async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const { page, limit } = req.query as any;
      const offset = (page - 1) * limit;

      const { data: images, error, count } = await supabaseAdmin
        .from('images')
        .select('*, generations(prompt, model)', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        // .range(offset, offset + limit - 1);

      if (error) throw error;

      const imagesWithUrls = await Promise.all(
        (images).map(async (img) => ({
          id: img.id,
          url: await storageService.getSignedUrl(img.webp_path || img.storage_path, 3600),
          downloadUrl: await storageService.getSignedUrl(img.storage_path, 3600),
          format: img.format,
          fileSize: img.file_size_bytes,
          width: img.width,
          height: img.height,
          prompt: img.generations?.prompt,
          model: img.generations?.model,
          isFavorited: img.is_favorited,
          isPublic: img.is_public,
          createdAt: img.created_at,
        }))
      );

      res.json({
        success: true,
        images: imagesWithUrls,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Get specific image
router.get('/:id', authenticateUser, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const imageId = req.params.id;

    const { data: image, error } = await supabaseAdmin
      .from('images')
      .select('*, generations(*)')
      .eq('id', imageId)
      .eq('user_id', userId)
      .single();

    if (error || !image) {
      return res.status(404).json({
        success: false,
        error: 'Image not found',
      });
    }

    const url = await storageService.getSignedUrl(image.webp_path || image.storage_path, 3600);
    const downloadUrl = await storageService.getSignedUrl(image.storage_path, 3600);

    res.json({
      success: true,
      image: {
        id: image.id,
        url,
        downloadUrl,
        width: image.width,
        height: image.height,
        isFavorited: image.is_favorited,
        isPublic: image.is_public,
        generation: image.generations,
        createdAt: image.created_at,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Update image
router.patch(
  '/:id',
  authenticateUser,
  validateBody(updateImageSchema),
  async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const imageId = req.params.id;
      const { is_favorited, is_public } = req.body;

      const updates: any = {
        updated_at: new Date().toISOString(),
      };

      if (is_favorited !== undefined) updates.is_favorited = is_favorited;
      if (is_public !== undefined) updates.is_public = is_public;

      const { data, error } = await supabaseAdmin
        .from('images')
        .update(updates)
        .eq('id', imageId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error || !data) {
        return res.status(404).json({
          success: false,
          error: 'Image not found',
        });
      }

      res.json({
        success: true,
        image: data,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// Delete image
router.delete('/:id', authenticateUser, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const imageId = req.params.id;

    const { data: image, error: fetchError } = await supabaseAdmin
      .from('images')
      .select('storage_path, webp_path')
      .eq('id', imageId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !image) {
      return res.status(404).json({
        success: false,
        error: 'Image not found',
      });
    }

    // Delete from storage (both original and WebP versions)
    const deletePromises = [storageService.deleteImage(image.storage_path)];
    if (image.webp_path) {
      deletePromises.push(storageService.deleteImage(image.webp_path));
    }
    await Promise.all(deletePromises);

    // Delete from database
    const { error: deleteError } = await supabaseAdmin
      .from('images')
      .delete()
      .eq('id', imageId)
      .eq('user_id', userId);

    if (deleteError) throw deleteError;

    res.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get favorited images
router.get('/favorites/list', authenticateUser, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const { data: images, error } = await supabaseAdmin
      .from('images')
      .select('*, generations(prompt, model)')
      .eq('user_id', userId)
      .eq('is_favorited', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const imagesWithUrls = await Promise.all(
      (images || []).map(async (img) => ({
        id: img.id,
        url: await storageService.getSignedUrl(img.webp_path || img.storage_path, 3600),
        downloadUrl: await storageService.getSignedUrl(img.storage_path, 3600),
        width: img.width,
        height: img.height,
        prompt: img.generations?.prompt,
        model: img.generations?.model,
        createdAt: img.created_at,
      }))
    );

    res.json({
      success: true,
      images: imagesWithUrls,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;