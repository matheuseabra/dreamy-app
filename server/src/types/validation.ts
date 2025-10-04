import { z } from 'zod';

// Common Fal image sizes
export const imageSizeSchema = z.enum([
  'square_hd',
  'square',
  'portrait_4_3',
  'portrait_16_9',
  'landscape_4_3',
  'landscape_16_9',
]);

// Generation request schema
export const generateImageSchema = z.object({
  model: z.string().min(1, 'Model is required'),
  prompt: z.string().min(1, 'Prompt is required').max(2000, 'Prompt too long'),
  negative_prompt: z.string().max(1000).optional(),
  image_size: imageSizeSchema.optional(),
  num_images: z.number().int().min(1).max(4).default(1),
  seed: z.number().int().optional(),
  guidance_scale: z.number().min(0).max(20).optional(),
  num_inference_steps: z.number().int().min(1).max(100).optional(),
  enable_safety_checker: z.boolean().optional(),
  sync_mode: z.boolean().optional().default(false),
  // Additional model-specific options
  loras: z.array(z.object({
    path: z.string(),
    scale: z.number().optional(),
  })).optional(),
  image_url: z.string().url().optional(), // For image-to-image
  strength: z.number().min(0).max(1).optional(), // For image-to-image
  controlnet_conditioning_scale: z.number().min(0).max(2).optional(),
  expand_prompt: z.boolean().optional(),
  format: z.enum(['jpeg', 'png']).optional(),
});

export type GenerateImageInput = z.infer<typeof generateImageSchema>;

// Update image schema
export const updateImageSchema = z.object({
  is_favorited: z.boolean().optional(),
  is_public: z.boolean().optional(),
});

export type UpdateImageInput = z.infer<typeof updateImageSchema>;

// Update profile schema
export const updateProfileSchema = z.object({
  full_name: z.string().max(100).optional(),
  avatar_url: z.string().url().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// Query params schemas
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationInput = z.infer<typeof paginationSchema>;