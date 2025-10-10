// Shared query configuration for consistent caching across the app
export const QUERY_CONFIG = {
  // Default cache settings
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  refetchOnWindowFocus: false,
  retry: 2,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
} as const;

// Query keys for consistent cache management
export const QUERY_KEYS = {
  images: ["getImages"] as const,
  publicImages: ["public-images"] as const,
  user: ["user"] as const,
  credits: ["credits"] as const,
} as const;

// Helper function to create consistent query options
export const createQueryOptions = (overrides = {}) => ({
  ...QUERY_CONFIG,
  ...overrides,
});
