import { Router } from 'express';
import { authenticateUser, AuthRequest } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { generateLimiter } from '../middleware/rate-limit';
import { createError } from '../middleware/error-handler';
import supabaseAdmin from '../supabase/client';
import { generateVideoSchema } from '../types/video-validation';
import { VideoFalService } from '../services/fal-video-service';
import { VideoStorageService } from '../services/video-storage-service';
import { CreditService } from '../services/credit-service';
import { getVideoCreditsRequired } from '../utils/video-credits';

const router = Router();
const videoFalService = new VideoFalService();
const videoStorageService = new VideoStorageService();
const creditService = new CreditService();

/**
 * POST /api/generate-video
 * Generate videos using AI text-to-video models
 */
router.post(
  '/',
  authenticateUser,
  generateLimiter,
  validateBody(generateVideoSchema),
  async (req: AuthRequest, res) => {
    const userId = req.user!.id;
    let generationId: string | null = null;

    try {
      const input = req.body;

      // Calculate credits required based on model and duration
      const creditsRequired = getVideoCreditsRequired(
        input.model,
        input.duration_seconds
      );

      console.log(`Credits required for video generation: ${creditsRequired}`);

      // Check if user has sufficient credits
      const hasCredits = await creditService.checkCredits(userId, creditsRequired);
      if (!hasCredits) {
        throw createError('Insufficient credits for video generation', 402);
      }

      // Create generation record with media_type = 'video'
      const { data: generation, error: genError } = await supabaseAdmin
        .from('generations')
        .insert({
          user_id: userId,
          model: input.model,
          prompt: input.prompt,
          negative_prompt: input.negative_prompt,
          media_type: 'video',
          status: 'pending',
          credits_used: creditsRequired,
          num_images: 1, // Videos typically generate 1 output
          model_options: {
            image_size: input.image_size,
            aspect_ratio: input.aspect_ratio,
            duration_seconds: input.duration_seconds,
            fps: input.fps,
            seed: input.seed,
            guidance_scale: input.guidance_scale,
            num_inference_steps: input.num_inference_steps,
            enable_safety_checker: input.enable_safety_checker,
          },
        })
        .select()
        .single();

      if (genError) {
        console.error('Failed to create generation record:', genError);
        throw genError;
      }

      generationId = generation.id;

      // Build webhook URL for async processing
      const webhookUrl = process.env.WEBHOOK_BASE_URL
        ? `${process.env.WEBHOOK_BASE_URL}/api/webhooks/fal/${generationId}`
        : undefined;

      console.log({ webhookUrl })

      if (input.sync_mode) {
        // Synchronous mode: wait for video generation to complete
        console.log('Starting synchronous video generation');
        const startTime = Date.now();

        // Update status to processing
        await supabaseAdmin
          .from('generations')
          .update({ status: 'processing', started_at: new Date().toISOString() })
          .eq('id', generationId);

        // Generate video synchronously
        const result = await videoFalService.subscribe(input);

        // Process the result
        const video = result.data?.video || result.data?.videos?.[0];
        if (!video?.url) {
          throw new Error('No video URL in generation result');
        }

        // Upload video to storage
        const videoId = crypto.randomUUID();
        const { originalPath, metadata } = await videoStorageService.uploadFromUrl(
          userId,
          generationId,
          videoId,
          video.url
        );

        // Create video record
        await supabaseAdmin.from('videos').insert({
          id: videoId,
          generation_id: generationId,
          user_id: userId,
          storage_path: originalPath,
          url: video.url,
          content_type: video.content_type || metadata.contentType,
          format: video.content_type?.includes('webm') ? 'webm' : 'mp4',
          file_size_bytes: video.file_size || metadata.size,
          width: video.width,
          height: video.height,
          duration_seconds: video.duration || input.duration_seconds,
          fps: video.fps || input.fps,
          fal_metadata: {
            seed: result.data?.seed,
            prompt: input.prompt,
            ...video,
          },
        });

        // Update generation status
        const duration = Date.now() - startTime;
        await supabaseAdmin
          .from('generations')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            duration_ms: duration,
            fal_request_id: result.requestId,
          })
          .eq('id', generationId);

        // Deduct credits
        await creditService.deductCredits(userId, creditsRequired);

        // Get signed URL for the video
        const signedUrl = await videoStorageService.getSignedUrl(originalPath, 3600);

        res.json({
          success: true,
          generation: {
            id: generationId,
            status: 'completed',
            video: {
              id: videoId,
              url: signedUrl,
              width: video.width,
              height: video.height,
              duration_seconds: video.duration || input.duration_seconds,
            },
          },
        });
      } else {
        // Async mode: submit to queue and return immediately
        console.log('Submitting video generation to queue');

        const requestId = await videoFalService.submitGeneration(input, webhookUrl);

        // Update generation with fal request ID and status
        await supabaseAdmin
          .from('generations')
          .update({
            fal_request_id: requestId,
            status: 'in_queue',
            started_at: new Date().toISOString(),
          })
          .eq('id', generationId);

        res.json({
          success: true,
            generation: {
              id: generationId,
              status: 'in_queue',
              falRequestId: requestId,
              message: 'Video generation queued successfully. Use the status endpoint to check progress.',
            },
          });
      }
    } catch (error: any) {
      console.error('Video generation error:', error);

      // Update generation status to failed
      if (generationId) {
        await supabaseAdmin
          .from('generations')
          .update({
            status: 'failed',
            error_message: error.message || 'Unknown error',
            completed_at: new Date().toISOString(),
          })
          .eq('id', generationId);
      }

      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        error: error.message || 'Failed to generate video',
        details: error.details,
      });
    }
  }
);

/**
 * GET /api/generate-video/:id
 * Get video generation status and result
 */
router.get('/:id', authenticateUser, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const generationId = req.params.id;

    // Get generation record
    const { data: generation, error } = await supabaseAdmin
      .from('generations')
      .select('*')
      .eq('id', generationId)
      .eq('user_id', userId)
      .eq('media_type', 'video')
      .single();

    if (error || !generation) {
      return res.status(404).json({
        success: false,
        error: 'Video generation not found',
      });
    }

    // If generation is queued or processing, get latest status from Fal
    if (
      generation.fal_request_id &&
      (generation.status === 'in_queue' || generation.status === 'processing')
    ) {
      try {
        const falStatus = await videoFalService.getStatus(
          generation.model,
          generation.fal_request_id
        );

        // Update status in database
        const newStatus = falStatus.status === 'IN_PROGRESS' ? 'processing' : generation.status;
        if (newStatus !== generation.status) {
          await supabaseAdmin
            .from('generations')
            .update({ status: newStatus })
            .eq('id', generationId);
          generation.status = newStatus;
        }
      } catch (err) {
        console.error('Failed to get Fal status:', err);
        // Continue with database status
      }
    }

    // Get associated video if completed
    let video = null;
    if (generation.status === 'completed') {
      const { data: videoData } = await supabaseAdmin
        .from('videos')
        .select('*')
        .eq('generation_id', generationId)
        .single();

      if (videoData) {
        const signedUrl = await videoStorageService.getSignedUrl(
          videoData.storage_path,
          3600
        );

        video = {
          id: videoData.id,
          url: signedUrl,
          width: videoData.width,
          height: videoData.height,
          duration_seconds: videoData.duration_seconds,
          format: videoData.format,
          file_size_bytes: videoData.file_size_bytes,
        };
      }
    }

    res.json({
      success: true,
      generation: {
        id: generation.id,
        status: generation.status,
        queuePosition: generation.queue_position,
        prompt: generation.prompt,
        model: generation.model,
        error: generation.error_message,
        video,
        createdAt: generation.created_at,
        completedAt: generation.completed_at,
      },
    });
  } catch (error: any) {
    console.error('Get video status error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get video generation status',
    });
  }
});

/**
 * DELETE /api/generate-video/:id
 * Cancel a queued or processing video generation
 */
router.delete('/:id', authenticateUser, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const generationId = req.params.id;

    // Get generation record
    const { data: generation, error } = await supabaseAdmin
      .from('generations')
      .select('*')
      .eq('id', generationId)
      .eq('user_id', userId)
      .eq('media_type', 'video')
      .single();

    if (error || !generation) {
      return res.status(404).json({
        success: false,
        error: 'Video generation not found',
      });
    }

    // Can only cancel queued or processing generations
    if (generation.status !== 'in_queue' && generation.status !== 'processing') {
      return res.status(400).json({
        success: false,
        error: 'Can only cancel queued or processing video generations',
      });
    }

    // Try to cancel on Fal if we have a request ID
    if (generation.fal_request_id) {
      try {
        await videoFalService.cancelRequest(
          generation.model,
          generation.fal_request_id
        );
      } catch (err) {
        console.error('Failed to cancel Fal request:', err);
        // Continue with local cancellation even if Fal cancel fails
      }
    }

    // Update generation status to failed/cancelled
    await supabaseAdmin
      .from('generations')
      .update({
        status: 'failed',
        error_message: 'Cancelled by user',
        completed_at: new Date().toISOString(),
      })
      .eq('id', generationId);

    // Refund credits
    await creditService.refundCredits(userId, generation.credits_used);

    res.json({
      success: true,
      message: 'Video generation cancelled successfully',
    });
  } catch (error: any) {
    console.error('Cancel video generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to cancel video generation',
    });
  }
});

export default router;
