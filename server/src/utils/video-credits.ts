/**
 * Video Credit Calculation Utility
 *
 * Calculates credits required for video generation based on model and duration.
 * Different models have different cost structures per second of video.
 */

// Credits per second for each text-to-video model
// These are estimated rates - adjust based on actual Fal.ai pricing
const VIDEO_CREDITS_PER_SECOND: Record<string, number> = {
  'fal-ai/sora-2/text-to-video': 50,                              // Premium quality, highest cost
  'fal-ai/veo3/fast': 10,                                         // Fast and cost-effective
  'fal-ai/kling-video/v2.5-turbo/pro/text-to-video': 25,        // Professional quality, mid-high cost
  'fal-ai/wan-25-preview/text-to-video': 12,                     // Preview model, moderate cost
  'fal-ai/minimax/hailuo-02/standard/text-to-video': 25,
  'fal-ai/kandinsky5/text-to-video': 20,
};

// Minimum credits per generation (even for 1 second)
const MIN_VIDEO_CREDITS = 5;

/**
 * Calculate credits required for video generation
 * @param model - The Fal.ai model ID
 * @param durationSeconds - Video duration in seconds
 * @returns Number of credits required
 * @throws Error if model is not recognized
 */
export function getVideoCreditsRequired(model: string, durationSeconds: number): number {
  const rate = VIDEO_CREDITS_PER_SECOND[model];

  if (!rate) {
    throw new Error(`Unknown video model for credit calculation: ${model}`);
  }

  // Calculate credits: rate * duration, rounded up, with minimum
  const calculatedCredits = Math.ceil(rate * durationSeconds);
  return Math.max(MIN_VIDEO_CREDITS, calculatedCredits);
}

/**
 * Get the credit rate per second for a specific model
 * @param model - The Fal.ai model ID
 * @returns Credits per second or null if model not found
 */
export function getVideoCreditRate(model: string): number | null {
  return VIDEO_CREDITS_PER_SECOND[model] || null;
}

/**
 * Check if a model is a known video model
 * @param model - The Fal.ai model ID
 * @returns true if model is a video model
 */
export function isVideoModel(model: string): boolean {
  return model in VIDEO_CREDITS_PER_SECOND;
}

/**
 * Get all supported video models
 * @returns Array of video model IDs
 */
export function getSupportedVideoModels(): string[] {
  return Object.keys(VIDEO_CREDITS_PER_SECOND);
}

/**
 * Estimate cost for different durations of a video model
 * Useful for displaying pricing to users
 * @param model - The Fal.ai model ID
 * @returns Object with duration:credits mapping
 */
export function getVideoPricingEstimates(model: string): Record<number, number> | null {
  const rate = getVideoCreditRate(model);
  if (!rate) return null;

  return {
    2: getVideoCreditsRequired(model, 2),
    5: getVideoCreditsRequired(model, 5),
    10: getVideoCreditsRequired(model, 10),
    15: getVideoCreditsRequired(model, 15),
    30: getVideoCreditsRequired(model, 30),
    60: getVideoCreditsRequired(model, 60),
  };
}
