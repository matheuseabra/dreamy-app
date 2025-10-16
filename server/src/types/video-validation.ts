import { z } from 'zod';

// Video aspect ratios (some models use these instead of image_size)
export const videoAspectRatioSchema = z.enum([
  '16:9',
  '9:16',
  '1:1',
  '4:3',
  '3:4',
  '21:9',
]);

// Image size schema (reused from image validation for models that support it)
export const videoImageSizeSchema = z.enum([
  'square_hd',
  'square',
  'portrait_4_3',
  'portrait_16_9',
  'landscape_4_3',
  'landscape_16_9',
]);

// Video generation request schema
export const generateVideoSchema = z.object({
  model: z.string().min(1, 'Model is required'),
  prompt: z.string().min(1, 'Prompt is required').max(2000, 'Prompt too long'),
  negative_prompt: z.string().max(1000).optional(),

  // Size parameters (models vary - some use image_size, others use aspect_ratio)
  image_size: videoImageSizeSchema.optional(),
  aspect_ratio: videoAspectRatioSchema.optional(),

  // Video-specific parameters
  // Duration varies by model:
  // - Sora 2: 4, 8, or 12 seconds
  // - Veo3 Fast: 4, 6, or 8 seconds
  // - Kling v2.5: 5 or 10 seconds
  duration_seconds: z.number().int().min(1).max(12).default(6),
  fps: z.number().int().min(1).max(60).optional(),

  // Common generation parameters
  seed: z.number().int().optional(),
  // Guidance scale (maps to cfg_scale for some models)
  guidance_scale: z.number().min(0).max(20).optional(),
  num_inference_steps: z.number().int().min(1).max(100).optional(),
  enable_safety_checker: z.boolean().optional(),

  // Model-specific parameters
  resolution: z.enum(['480p', '720p', '1080p']).optional(),
  enhance_prompt: z.boolean().optional(),
  generate_audio: z.boolean().optional(),
  audio_url: z.string().url().optional(),

  // Mode: async by default for videos (they take longer)
  sync_mode: z.boolean().optional().default(false),

  // Model-specific options (for additional parameters)
  model_options: z.any().optional(),
});

export type GenerateVideoInput = z.infer<typeof generateVideoSchema>;

// Update video schema (for PATCH operations)
export const updateVideoSchema = z.object({
  is_favorited: z.boolean().optional(),
  is_public: z.boolean().optional(),
});

export type UpdateVideoInput = z.infer<typeof updateVideoSchema>;

// Video query params
export const videoQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  favorites_only: z.coerce.boolean().optional(),
  sort_by: z.enum(['created_at', 'duration_seconds']).optional().default('created_at'),
  sort_order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type VideoQueryInput = z.infer<typeof videoQuerySchema>;
