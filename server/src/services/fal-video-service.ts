import { fal } from '@fal-ai/client';
import type { GenerateVideoInput } from '../types/video-validation';
import { createError } from '../middleware/error-handler';

/**
 * Video Fal Service
 *
 * Handles all interactions with Fal.ai for text-to-video generation.
 * Separate from FalService to keep image and video logic isolated.
 */

fal.config({
  credentials: process.env.FAL_API_KEY! || '',
});

export class VideoFalService {
  /**
   * Build generation input with model-specific parameter handling
   * Different T2V models have different parameter requirements
   */
  private buildInput(params: GenerateVideoInput): any {
    const input: any = {
      prompt: params.prompt,
    };

    // Add optional parameters
    if (params.negative_prompt) {
      input.negative_prompt = params.negative_prompt;
    }

    // Duration handling (most models use 'duration')
    if (params.duration_seconds !== undefined) {
      input.duration = params.duration_seconds;
    }

    // FPS handling
    if (params.fps !== undefined) {
      input.fps = params.fps;
    }

    // Seed for reproducibility
    if (params.seed !== undefined) {
      input.seed = params.seed;
    }

    // Guidance scale
    if (params.guidance_scale !== undefined) {
      input.guidance_scale = params.guidance_scale;
    }

    // Inference steps
    if (params.num_inference_steps !== undefined) {
      input.num_inference_steps = params.num_inference_steps;
    }

    // Safety checker
    if (params.enable_safety_checker !== undefined) {
      input.enable_safety_checker = params.enable_safety_checker;
    }

    // Model-specific parameter handling
    this.applyModelSpecificParameters(params.model, input, params);

    // Add any additional model options
    if (params.model_options) {
      Object.assign(input, params.model_options);
    }

    return input;
  }

  /**
   * Apply model-specific parameter transformations based on Fal.ai schemas
   */
  private applyModelSpecificParameters(
    model: string,
    input: any,
    params: GenerateVideoInput
  ): void {
    switch (model) {
      case 'fal-ai/sora-2/text-to-video':
        // Sora 2 schema: prompt, resolution, aspect_ratio, duration
        // Duration: 4, 8, or 12 seconds
        // Aspect ratio: "9:16" or "16:9"
        // Resolution: "720p" (only option)
        input.resolution = '720p';
        if (params.aspect_ratio) {
          input.aspect_ratio = params.aspect_ratio;
        } else {
          input.aspect_ratio = '16:9'; // Default
        }
        // Map duration_seconds to Sora's duration format
        if (params.duration_seconds) {
          if (params.duration_seconds <= 4) input.duration = 4;
          else if (params.duration_seconds <= 8) input.duration = 8;
          else input.duration = 12;
        }
        break;

      case 'fal-ai/veo3/fast':
        // Veo3 Fast schema: prompt, aspect_ratio, duration, negative_prompt,
        // enhance_prompt, seed, auto_fix, resolution, generate_audio
        // Duration: "4s", "6s", or "8s" (string format)
        // Aspect ratio: "16:9", "9:16", or "1:1"
        // Resolution: "720p" or "1080p"
        if (params.aspect_ratio) {
          input.aspect_ratio = params.aspect_ratio;
        } else {
          input.aspect_ratio = '16:9'; // Default
        }
        // Map duration_seconds to Veo3's string format
        if (params.duration_seconds) {
          if (params.duration_seconds <= 4) input.duration = '4s';
          else if (params.duration_seconds <= 6) input.duration = '6s';
          else input.duration = '8s';
        }
        input.resolution = '720p'; // Default, can be upgraded to 1080p
        input.enhance_prompt = true; // Default
        input.auto_fix = true; // Default
        input.generate_audio = true; // Default
        break;

      case 'fal-ai/kling-video/v2.5-turbo/pro/text-to-video':
        // Kling v2.5 Turbo Pro schema: prompt, duration, aspect_ratio,
        // negative_prompt, cfg_scale
        // Duration: "5" or "10" (enum string)
        // Aspect ratio: "16:9", "9:16", or "1:1"
        // CFG scale: 0.5 (default)
        if (params.aspect_ratio) {
          input.aspect_ratio = params.aspect_ratio;
        } else if (params.image_size) {
          // Map image_size to aspect_ratio for Kling
          input.aspect_ratio = this.mapImageSizeToAspectRatio(params.image_size);
        } else {
          input.aspect_ratio = '16:9'; // Default
        }
        // Map duration_seconds to Kling's enum string format
        if (params.duration_seconds) {
          input.duration = params.duration_seconds <= 5 ? '5' : '10';
        }
        // Kling uses cfg_scale instead of guidance_scale
        if (params.guidance_scale !== undefined) {
          input.cfg_scale = params.guidance_scale;
        } else {
          input.cfg_scale = 0.5; // Default
        }
        // Default negative prompt if not provided
        if (!input.negative_prompt) {
          input.negative_prompt = 'blur, distort, and low quality';
        }
        break;

      case 'fal-ai/wan-25-preview/text-to-video':
        // WAN 2.5 Preview schema: prompt, audio_url, aspect_ratio, resolution,
        // duration, negative_prompt, enable_prompt_expansion, seed
        // Duration: "5" or "10" (enum string)
        // Aspect ratio: "16:9", "9:16", or "1:1"
        // Resolution: "480p", "720p", or "1080p"
        if (params.aspect_ratio) {
          input.aspect_ratio = params.aspect_ratio;
        } else if (params.image_size) {
          input.aspect_ratio = this.mapImageSizeToAspectRatio(params.image_size);
        } else {
          input.aspect_ratio = '16:9'; // Default
        }
        input.resolution = '1080p'; // Default to highest quality
        // Map duration_seconds to WAN's enum string format
        if (params.duration_seconds) {
          input.duration = params.duration_seconds <= 5 ? '5' : '10';
        }
        input.enable_prompt_expansion = true; // Default
        // Default negative prompt if not provided
        if (!input.negative_prompt) {
          input.negative_prompt = 'low resolution, error, worst quality, low quality, defects';
        }
        break;

      default:
        // For unknown models, pass both if available
        if (params.image_size) input.image_size = params.image_size;
        if (params.aspect_ratio) input.aspect_ratio = params.aspect_ratio;
        break;
    }
  }

  /**
   * Map image_size to aspect_ratio for models that prefer ratios
   */
  private mapImageSizeToAspectRatio(imageSize: string): string {
    const sizeToRatioMap: Record<string, string> = {
      'square_hd': '1:1',
      'square': '1:1',
      'portrait_4_3': '3:4',
      'portrait_16_9': '9:16',
      'landscape_4_3': '4:3',
      'landscape_16_9': '16:9',
    };

    return sizeToRatioMap[imageSize] || '16:9';
  }

  /**
   * Submit video generation request to Fal queue
   * @param params - Video generation parameters
   * @param webhookUrl - Optional webhook URL for async completion notification
   * @returns Request ID
   */
  async submitGeneration(
    params: GenerateVideoInput,
    webhookUrl?: string
  ): Promise<string> {
    try {
      const input = this.buildInput(params);

      console.log('Submitting video generation to Fal:', {
        model: params.model,
        duration: params.duration_seconds,
        hasWebhook: !!webhookUrl,
      });

      // Submit to queue
      const { request_id } = await fal.queue.submit(params.model, {
        input,
        webhookUrl,
      });

      console.log('Video generation queued:', { requestId: request_id });

      return request_id;
    } catch (error: any) {
      console.error('Fal video submission error:', error);
      throw createError(
        error.message || 'Failed to submit video generation request',
        500
      );
    }
  }

  /**
   * Get status of a queued video request
   * @param model - The model ID
   * @param requestId - The request ID
   * @returns Status information
   */
  async getStatus(model: string, requestId: string) {
    try {
      const status = await fal.queue.status(model, {
        requestId,
        logs: true,
      });

      return {
        status: status.status
      };
    } catch (error: any) {
      console.error('Fal video status error:', error);
      throw createError('Failed to get video generation status', 500);
    }
  }

  /**
   * Get result of a completed video request
   * @param model - The model ID
   * @param requestId - The request ID
   * @returns Generation result
   */
  async getResult(model: string, requestId: string) {
    try {
      const result = await fal.queue.result(model, {
        requestId,
      });

      return result;
    } catch (error: any) {
      console.error('Fal video result error:', error);
      throw createError('Failed to get video generation result', 500);
    }
  }

  /**
   * Subscribe to a video request (synchronous mode - wait for completion)
   * @param params - Video generation parameters
   * @returns Generation result
   */
  async subscribe(params: GenerateVideoInput) {
    try {
      const input = this.buildInput(params);

      console.log('Starting synchronous video generation:', {
        model: params.model
      });

      const result = await fal.subscribe(params.model, {
        input,
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS') {
            console.log('Video generation in progress:', update.logs);
          }
        },
      });

      console.log('Video generation completed');

      return result;
    } catch (error: any) {
      console.error('Fal video subscribe error:', error);
      throw createError(
        error.message || 'Failed to generate video',
        500
      );
    }
  }

  /**
   * Cancel a queued video request
   * @param model - The model ID
   * @param requestId - The request ID
   */
  async cancelRequest(model: string, requestId: string) {
    try {
      console.log('Cancelling video generation:', { model, requestId });

      // Fal doesn't provide a direct cancel method in the SDK
      // Need to call the REST API directly
      const response = await fetch(
        `https://queue.fal.run/${model}/requests/${requestId}/cancel`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Key ${process.env.FAL_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'Failed to cancel request');
      }

      const result = await response.json();
      console.log('Video generation cancelled successfully');

      return result;
    } catch (error: any) {
      console.error('Fal video cancel error:', error);
      throw createError('Failed to cancel video generation', 500);
    }
  }
}
