# Client-Side Video Generation Implementation

## Overview

This document describes the client-side implementation for the video generation feature in Wizzard/Dreamy Studio. The implementation follows the same patterns established for image generation to ensure consistency and maintainability.

## Architecture

### Component Structure

```
client/src/
├── pages/
│   └── Video.tsx                    # Main video generation page
├── components/
│   ├── VideoCard.tsx                # Individual video card with thumbnail
│   ├── VideoGallery.tsx             # Grid layout for video cards
│   ├── VideoPromptBar.tsx           # Video generation controls
│   └── VideoModal.tsx               # Video playback modal
├── hooks/
│   ├── useVideoGeneration.ts        # Video generation logic
│   └── api/
│       └── useVideos.ts             # React Query hooks for video API
├── lib/
│   └── video-api.ts                 # Video API client functions
└── config/
    └── videoModels.ts               # Video model definitions
```

## Key Features

### 1. Video Models Configuration (`config/videoModels.ts`)

Four text-to-video models are supported:

- **Sora 2**: Premium quality (50 credits/sec)
- **Veo 3 Fast**: Fast and cost-effective (10 credits/sec)
- **Kling v2.5 Turbo Pro**: Professional quality (25 credits/sec)
- **WAN 2.5 Preview**: Preview model (12 credits/sec)

Each model has:
- Unique ID (Fal.ai model identifier)
- Display name
- Description
- Icon (Lucide React icon)
- Credits per second rate

### 2. Video API Client (`lib/video-api.ts`)

Handles all video-related API calls:

#### Generation
- `generateVideo()` - Create new video generation
- `getVideoGenerationStatus()` - Poll generation status
- `cancelVideoGeneration()` - Cancel queued/processing job

#### Management
- `listVideos()` - List user's videos with pagination
- `getVideo()` - Get single video by ID
- `updateVideo()` - Update video properties (favorite, public)
- `deleteVideo()` - Delete video
- `getFavoriteVideos()` - Get favorited videos
- `toggleVideoFavorite()` - Toggle favorite status
- `publishVideo()` / `unpublishVideo()` - Manage public status

### 3. Video Generation Hook (`hooks/useVideoGeneration.ts`)

Main state management for video generation:

#### State Variables
- `prompt` - Main prompt text
- `negativePrompt` - What to avoid
- `selectedModel` - Currently selected video model
- `aspectRatio` - Video aspect ratio (16:9, 9:16, 1:1, etc.)
- `durationSeconds` - Video duration (1-30 seconds)
- `fps` - Frames per second (24, 30, 60)
- `guidanceScale` - Generation guidance (1-20)
- `seed` - Optional random seed
- `enableSafetyChecker` - Safety filter toggle
- `isGenerating` - Generation in progress flag
- `generatedVideosLocal` - Local state for optimistic updates

#### Key Functions
- `handleGenerate()` - Initiates video generation
- `pollGenerationStatus()` - Polls for async completion
- `cleanup()` - Clears polling intervals on unmount

#### Generation Flow
1. User submits prompt and parameters
2. Mutation sends request to `/api/generate-video`
3. If async, starts polling every 5 seconds
4. On completion, adds video to local state
5. Invalidates React Query cache for fresh data

### 4. React Query Hooks (`hooks/api/useVideos.ts`)

Query hooks for server state management:

- `useVideos()` - List videos with pagination/filters
- `useVideo()` - Get single video
- `useFavoriteVideos()` - Get favorite videos only
- `useUpdateVideo()` - Mutation for updates
- `useToggleVideoFavorite()` - Toggle favorite status
- `useDeleteVideo()` - Delete mutation

All hooks automatically invalidate related queries on mutation success.

### 5. Video Card Component (`components/VideoCard.tsx`)

Displays individual video with:
- Video thumbnail or preview frame
- Play button overlay on hover
- Duration badge
- Info overlay with prompt and model
- Aspect ratio preserved (aspect-video)

### 6. Video Gallery Component (`components/VideoGallery.tsx`)

Grid layout for videos:
- 3 columns on desktop (xl), 2 on tablet (sm), 1 on mobile
- Loading skeletons during fetch
- Empty state with helpful message
- Optimistic loading card during generation
- Shimmer animation for generating card

### 7. Video Prompt Bar Component (`components/VideoPromptBar.tsx`)

Comprehensive generation controls:

#### Dropdowns
- **Model Selector**: Choose from 4 video models
- **Aspect Ratio**: 16:9, 9:16, 1:1, 4:3, 3:4
- **Duration**: 1-30 seconds slider with credit estimate
- **Advanced Settings**:
  - FPS selection (24, 30, 60)
  - Guidance scale slider (1-20)
  - Negative prompt textarea
  - Safety checker toggle

#### Features
- Auto-resizing textarea for main prompt
- Real-time credit cost estimation
- Disabled generate button when no prompt
- Loading spinner during generation

### 8. Video Modal Component (`components/VideoModal.tsx`)

Full-screen video player with:
- HTML5 video player with controls
- Poster image (thumbnail) support
- Action buttons:
  - Download (creates download link)
  - Favorite (toggles favorite status)
  - Share (Web Share API or clipboard fallback)
  - Delete (with confirmation)
- Duration display
- Model and prompt info

### 9. Video Page (`pages/Video.tsx`)

Main video generation page:

#### Layout
- Gallery in main content area
- Fixed prompt bar at bottom (like Generate page)
- Modal overlay for video playback

#### Features
- Fetches existing videos on mount
- Transforms API data to local format
- Handles video click to open modal
- Polls for updates during generation
- Cleanup on unmount

## Integration Points

### Routing (`App.tsx`)

Added `/video` route:
```tsx
<Route
  path="/video"
  element={
    <ProtectedRoute>
      <Layout>
        <Video />
      </Layout>
    </ProtectedRoute>
  }
/>
```

### Navigation (`Sidebar.tsx`)

Added "Video" link to navigation:
```tsx
{
  path: "/video",
  icon: Video,
  label: "Video",
}
```

## Design Patterns

### Consistency with Image Generation

The video implementation mirrors the image generation architecture:

1. **Same Hook Pattern**: `useVideoGeneration` matches `useImageGeneration`
2. **Similar Components**: VideoCard/ImageCard, VideoGallery/CombinedGallery
3. **Parallel API Structure**: video-api.ts mirrors existing API clients
4. **Unified Layout**: Fixed prompt bar, gallery grid, modal playback

### Separation of Concerns

- **State Management**: Hooks handle all state logic
- **UI Components**: Pure presentational components
- **API Layer**: Centralized API client with typed responses
- **Query Management**: React Query for server state

### Optimistic Updates

- Shows generating card immediately in gallery
- Local state updates before server confirmation
- Polling for async job completion
- Automatic cache invalidation

### Error Handling

- Rate limiting detection
- Insufficient credits detection
- Generic error fallback
- User-friendly toast messages

## Data Flow

### Video Generation Flow

```
User Input (VideoPromptBar)
  ↓
useVideoGeneration.handleGenerate()
  ↓
generateVideo() API call
  ↓
Server creates generation record
  ↓
Poll with getVideoGenerationStatus()
  ↓
On completion: Update local state
  ↓
Invalidate React Query cache
  ↓
Gallery refreshes with new video
```

### Video List Flow

```
Video Page Mount
  ↓
useVideos() hook
  ↓
listVideos() API call
  ↓
Transform response data
  ↓
Update VideoGallery
```

## Performance Considerations

### Polling Strategy

- Poll every 5 seconds during generation
- Stop polling on completion or error
- Cleanup intervals on unmount
- Optional polling for video list (if isGenerating)

### Lazy Loading

- Video cards use `loading="lazy"` for thumbnails
- Video preview uses `preload="metadata"`
- Only full video loads on modal open

### Caching

- React Query staleTime: 30 seconds
- Automatic background refetch
- Optimistic updates reduce perceived latency

## Styling

### Tailwind Classes

- Consistent spacing with existing pages
- `aspect-video` for 16:9 ratio cards
- Hover states for interactivity
- Dark mode support via theme variables

### Animations

- Shimmer effect for loading cards
- Smooth transitions on hover
- Loading spinners for async operations

## Testing Recommendations

### Unit Tests
- Hook state management
- API client functions
- Component rendering

### Integration Tests
- Full generation flow
- Polling mechanism
- Error scenarios

### E2E Tests
- Complete user journey (prompt → generate → view)
- Modal interactions
- Favorite/delete actions

## Future Enhancements

### Potential Improvements

1. **Thumbnail Generation**: Server-side ffmpeg extraction
2. **Progress Tracking**: Show queue position and ETA
3. **Batch Operations**: Multi-select for favorites/delete
4. **Advanced Filters**: Filter by model, duration, date
5. **Video Editing**: Trim, crop, add effects
6. **Public Gallery**: Browse/share public videos
7. **Credits Calculator**: Preview cost before generation
8. **Model Comparison**: Side-by-side results

### Known Limitations

1. **No Sync Mode**: All video generation is async
2. **No Retry Logic**: Failed generations require manual restart
3. **No Partial Progress**: Can't pause/resume generation
4. **Fixed Polling Interval**: No adaptive polling based on duration

## Environment Variables

No additional client-side environment variables required. Uses existing:
- `VITE_API_URL` - Backend API URL
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anon key

## Dependencies

All dependencies already present in project:
- `@tanstack/react-query` - Server state management
- `lucide-react` - Icons
- `sonner` - Toast notifications
- React Router - Routing
- Tailwind CSS - Styling

## Deployment Checklist

- [ ] Ensure backend `/api/generate-video` endpoint is live
- [ ] Verify Supabase `videos` table exists with RLS policies
- [ ] Check `generated-videos` storage bucket is created
- [ ] Test webhook handling for video completion
- [ ] Verify credit deduction for video models
- [ ] Test all four video models in production
- [ ] Monitor polling performance and adjust intervals if needed
- [ ] Set up error tracking for video generation failures

## Related Documentation

- `VIDEO_IMPLEMENTATION_SUMMARY.md` - Backend implementation
- `VIDEO_MODEL_SCHEMAS.md` - Model-specific parameter schemas
- `API.md` - API endpoint documentation
- `AGENTS.md` - AI assistant guide (includes video context)

---

**Last Updated**: Current implementation
**Status**: Complete and ready for testing
**Maintainer**: Development team
