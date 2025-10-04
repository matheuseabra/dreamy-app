import { fal } from '@fal-ai/client';
import { createError } from '../middleware/error-handler';
import type { GenerateImageInput } from '../types/validation';

fal.config({
  credentials: process.env.FAL_API_KEY! || '',
});

export class FalService {
  /**
   * Submit image generation request to Fal queue
   */
  async submitGeneration(params: GenerateImageInput, webhookUrl?: string) {
    try {
      // Build input for fal
      const input: any = {
        prompt: params.prompt,
      };

      if (params.negative_prompt) input.negative_prompt = params.negative_prompt;
      if (params.image_size) input.image_size = params.image_size;
      if (params.num_images) input.num_images = params.num_images;
      if (params.seed !== undefined) input.seed = params.seed;
      if (params.guidance_scale !== undefined) input.guidance_scale = params.guidance_scale;
      if (params.num_inference_steps !== undefined) input.num_inference_steps = params.num_inference_steps;
      if (params.enable_safety_checker !== undefined) input.enable_safety_checker = params.enable_safety_checker;
      if (params.loras) input.loras = params.loras;
      if (params.image_url) input.image_url = params.image_url;
      if (params.strength !== undefined) input.strength = params.strength;
      if (params.controlnet_conditioning_scale !== undefined) {
        input.controlnet_conditioning_scale = params.controlnet_conditioning_scale;
      }
      if (params.expand_prompt !== undefined) input.expand_prompt = params.expand_prompt;
      if (params.format) input.format = params.format;

      // Submit to queue
      const { request_id } = await fal.queue.submit(params.model, {
        input,
        webhookUrl
      });

      return request_id;
    } catch (error: any) {
      console.error('Fal submission error:', error);
      throw createError(
        error.message || 'Failed to submit generation request',
        500
      );
    }
  }

  /**
   * Get status of a queued request
   */
  async getStatus(model: string, requestId: string) {
    try {
      const status = await fal.queue.status(model, {
        requestId,
        logs: true,
      });

      return {
        status: status.status,
      };
    } catch (error: any) {
      console.error('Fal status error:', error);
      throw createError('Failed to get generation status', 500);
    }
  }

  /**
   * Get result of a completed request
   */
  async getResult(model: string, requestId: string) {
    try {
      const result = await fal.queue.result(model, {
        requestId,
      });

      return result;
    } catch (error: any) {
      console.error('Fal result error:', error);
      throw createError('Failed to get generation result', 500);
    }
  }

  /**
   * Subscribe to a request (wait for completion)
   */
  async subscribe(params: GenerateImageInput) {
    try {
      const input: any = {
        prompt: params.prompt,
      };

      if (params.negative_prompt) input.negative_prompt = params.negative_prompt;
      if (params.image_size) input.image_size = params.image_size;
      if (params.num_images) input.num_images = params.num_images;
      if (params.seed !== undefined) input.seed = params.seed;
      if (params.guidance_scale !== undefined) input.guidance_scale = params.guidance_scale;
      if (params.num_inference_steps !== undefined) input.num_inference_steps = params.num_inference_steps;
      if (params.enable_safety_checker !== undefined) input.enable_safety_checker = params.enable_safety_checker;
      if (params.loras) input.loras = params.loras;
      if (params.image_url) input.image_url = params.image_url;
      if (params.strength !== undefined) input.strength = params.strength;
      if (params.controlnet_conditioning_scale !== undefined) {
        input.controlnet_conditioning_scale = params.controlnet_conditioning_scale;
      }
      if (params.expand_prompt !== undefined) input.expand_prompt = params.expand_prompt;
      if (params.format) input.format = params.format;

      const result = await fal.subscribe(params.model, {
        input,
        logs: true,
      });

      return result;
    } catch (error: any) {
      console.error('Fal subscribe error:', error);
      throw createError(
        error.message || 'Failed to generate image',
        500
      );
    }
  }

  /**
   * Cancel a queued request
   */
  async cancelRequest(model: string, requestId: string) {
    try {
      // Note: Fal doesn't provide a direct cancel method in the client
      // You'd need to call the REST API directly
      const response = await fetch(
        `https://queue.fal.run/${model}/requests/${requestId}/cancel`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Key ${process.env.FAL_API_KEY}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to cancel request');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Fal cancel error:', error);
      throw createError('Failed to cancel generation', 500);
    }
  }
}