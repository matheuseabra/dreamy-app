import { z } from 'zod';
import { imageSizeSchema } from '../types/validation';

export type ImageSize = z.infer<typeof imageSizeSchema>;

// Regular size to aspect ratio mapping
export const SIZE_TO_RATIO: Record<ImageSize, string> = {
  square_hd: '1:1',
  square: '1:1',
  portrait_4_3: '3:4',
  portrait_16_9: '9:16',
  landscape_4_3: '4:3',
  landscape_16_9: '16:9',
};

// Nano Banana supported aspect ratios
export const NANO_BANANA_RATIOS = [
  '21:9',
  '1:1',
  '4:3',
  '3:2',
  '2:3',
  '5:4',
  '4:5',
  '3:4',
  '16:9',
  '9:16',
] as const;

export type NanoBananaRatio = typeof NANO_BANANA_RATIOS[number];

// Map our standard sizes to Nano Banana ratios
export const SIZE_TO_NANO_RATIO: Record<ImageSize, NanoBananaRatio> = {
  square_hd: '1:1',
  square: '1:1',
  portrait_4_3: '3:4',
  portrait_16_9: '9:16',
  landscape_4_3: '4:3',
  landscape_16_9: '16:9',
};