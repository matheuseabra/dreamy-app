# Video Client Quick Start Guide

## Overview

This guide will help you test the new video generation feature on the client side. The video UI follows the same patterns as image generation for consistency.

## Prerequisites

1. Backend video endpoints must be running (`/api/generate-video`, `/api/videos`)
2. Supabase `videos` table must exist with proper RLS policies
3. `generated-videos` storage bucket must be created in Supabase
4. Valid Fal.ai API key configured on backend
5. User must have sufficient credits

## Accessing the Video Page

### Navigation

1. **Via Sidebar**: Click on the "Video" link (🎬 icon) in the left sidebar
2. **Direct URL**: Navigate to `/video` in your browser

The page is protected by authentication, so you must be logged in.

## UI Components

### Video Prompt Bar (Bottom)

Located at the bottom of the page, similar to image generation:

#### Main Controls
- **Prompt Textarea**: Auto-expands as you type (max 200px height)
- **Model Selector**: Dropdown showing 4 video models with descriptions
- **Aspect Ratio**: Select from 16:9, 9:16, 1:1, 4:3, 3:4
- **Duration**: Slider from 1-30 seconds with live credit estimate
- **Generate Button**: Arrow up icon, disabled when prompt is empty

#### Advanced Settings (⚙️ dropdown)
- **FPS**: 24, 30, or 60 frames per second
- **Guidance Scale**: Slider from 1-20 (default 7)
- **Negative Prompt**: Text area for what to avoid
- **Safety Checker**: Toggle on/off

### Video Gallery (Center)

Grid layout showing generated videos:
- **Desktop (xl)**: 3 columns
- **Tablet (sm)**: 2 columns
- **Mobile**: 1 column

Each video card shows:
- Thumbnail or video preview
- Play button overlay on hover
- Duration badge (bottom-right)
- Prompt and model info on hover (bottom overlay)

### Video Modal (Overlay)

Clicking a video opens full-screen modal with:
- HTML5 video player with controls
- Download button
- Favorite button (heart icon)
- Share button (Web Share API or clipboard)
- Delete button (with confirmation)
- Video metadata (prompt, model, duration)

## Testing Workflow

### 1. Basic Video Generation

```
1. Enter prompt: "A serene sunset over the ocean with gentle waves"
2. Select model: "Veo 3 Fast" (cheapest for testing)
3. Set duration: 5 seconds
4. Keep default settings
5. Click generate button
```

**Expected Behavior:**
- Generate button shows spinner
- Toast notification: "Video generation started. This may take a few minutes..."
- Loading card appears in gallery with shimmer effect
- Polling starts every 5 seconds
- On completion: Toast "Video generated successfully!"
- Video appears in gallery
- Prompt clears

### 2. Test All Models

Test each model to verify parameters work:

#### Sora 2
```
Prompt: "A bustling city street at night with neon lights"
Duration: 10 seconds
Aspect Ratio: 16:9
Expected Cost: 500 credits (50 credits/sec × 10s)
```

#### Veo 3 Fast
```
Prompt: "A cat playing with a ball of yarn"
Duration: 5 seconds
Aspect Ratio: 1:1
Expected Cost: 50 credits (10 credits/sec × 5s)
```

#### Kling v2.5 Turbo Pro
```
Prompt: "A rocket launching into space"
Duration: 8 seconds
Aspect Ratio: 9:16
Expected Cost: 200 credits (25 credits/sec × 8s)
```

#### WAN 2.5 Preview
```
Prompt: "A waterfall in a lush forest"
Duration: 6 seconds
Aspect Ratio: 4:3
Expected Cost: 72 credits (12 credits/sec × 6s)
```

### 3. Test Advanced Settings

#### High Guidance Scale
```
Prompt: "A photorealistic eagle soaring through clouds"
Model: Veo 3 Fast
Duration: 5 seconds
Guidance Scale: 15 (move slider right)
```

#### With Negative Prompt
```
Prompt: "A beautiful garden with colorful flowers"
Negative Prompt: "people, buildings, roads"
Model: Veo 3 Fast
Duration: 5 seconds
```

#### Different FPS
```
Prompt: "A sports car racing on a track"
Model: Veo 3 Fast
Duration: 5 seconds
FPS: 60 (for smooth motion)
```

### 4. Test Modal Interactions

#### View Video
```
1. Click any generated video card
2. Verify modal opens
3. Verify video plays automatically
4. Check controls work (play, pause, seek, volume)
```

#### Download Video
```
1. Open video modal
2. Click "Download" button
3. Verify download starts (check browser downloads)
4. File should be named: video-{id}.mp4
```

#### Favorite Video
```
1. Open video modal
2. Click heart icon "Favorite" button
3. Heart should fill with color
4. Text changes to "Favorited"
5. Click again to unfavorite
```

#### Share Video
```
1. Open video modal
2. Click "Share" button
3. On mobile: Native share sheet appears
4. On desktop: "Link copied to clipboard!" alert
```

#### Delete Video
```
1. Open video modal
2. Click red "Delete" button
3. Confirmation prompt appears
4. Click OK
5. Modal closes
6. Video removed from gallery
7. Gallery refreshes
```

### 5. Test Error Scenarios

#### Insufficient Credits
```
1. Ensure credits < required amount
2. Try to generate video
3. Verify error toast: "Insufficient credits. Please add credits to continue."
```

#### Empty Prompt
```
1. Leave prompt empty
2. Generate button should be disabled
3. Try clicking (should not work)
```

#### Rate Limiting
```
1. Generate multiple videos rapidly
2. Should get toast: "Rate limit exceeded. Please wait a moment and try again."
```

#### Invalid Duration
```
This is prevented by UI slider (1-30 range)
But backend should validate and return error if bypassed
```

### 6. Test Polling and Status Updates

#### Monitor Network Tab
```
1. Start a video generation
2. Open browser DevTools → Network tab
3. Watch for calls to: GET /api/generate-video/{id}
4. Should occur every 5 seconds
5. Should stop when status = "completed" or "failed"
```

#### Check Status Messages
Look for these statuses in network responses:
- `pending` - Just created
- `in_queue` - Waiting in Fal queue
- `processing` - Currently generating
- `completed` - Done (video URL available)
- `failed` - Error occurred

#### Verify Cleanup
```
1. Start a generation
2. Navigate away from /video page before completion
3. Return to another page
4. Check DevTools → Network
5. Polling should have stopped (no more API calls)
```

## Browser Console Testing

### Check React Query Cache

```javascript
// In browser console
window.localStorage.getItem('REACT_QUERY_OFFLINE_CACHE')
```

### Monitor Hook State

Add temporary logging to `useVideoGeneration.ts`:
```typescript
console.log('Video Generation State:', {
  isGenerating,
  prompt,
  selectedModel,
  videosCount: generatedVideosLocal.length
});
```

### Check API Responses

```javascript
// Watch fetch calls in Network tab
// Verify response format matches:
{
  success: true,
  generation: {
    id: "...",
    status: "completed",
    video: {
      id: "...",
      url: "https://...",
      duration_seconds: 5
    }
  }
}
```

## Common Issues and Solutions

### Issue: Generate button disabled
**Solution**: Ensure prompt is not empty

### Issue: No videos showing in gallery
**Possible causes:**
- Backend not returning videos (check `/api/videos`)
- Auth token invalid (check localStorage)
- RLS policies blocking access
- Videos table empty

**Debug:**
```javascript
// Browser console
fetch('http://localhost:9000/api/videos', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
  }
}).then(r => r.json()).then(console.log)
```

### Issue: Modal not opening
**Check:**
- Verify onClick handler on VideoCard
- Check modalOpen state
- Look for console errors

### Issue: Video not playing in modal
**Possible causes:**
- Invalid video URL (signed URL expired)
- CORS issues
- Video format not supported by browser

**Debug:**
```javascript
// Check if URL is accessible
fetch('VIDEO_URL_HERE', { mode: 'no-cors' })
```

### Issue: Polling never stops
**Check:**
- Cleanup function in useVideoGeneration
- useEffect cleanup in Video page
- Status is correctly detected as "completed"

**Force stop:**
```javascript
// In browser console
clearInterval(window.intervalId) // if you expose it
```

### Issue: Credit estimate wrong
**Verify:**
- Model creditsPerSecond in videoModels.ts
- Calculation: creditsPerSecond × durationSeconds
- Should update live as duration slider moves

## Performance Testing

### Load Testing
```
1. Generate 20+ videos
2. Scroll through gallery
3. Check for lag or jank
4. Monitor memory usage in DevTools
```

### Network Performance
```
1. Throttle network to "Fast 3G" in DevTools
2. Try generating video
3. Check loading states work correctly
4. Verify timeouts don't cause issues
```

### Mobile Testing
```
1. Open on mobile device or DevTools mobile view
2. Test responsive grid (1 column)
3. Verify touch interactions work
4. Check modal on small screens
```

## Accessibility Testing

### Keyboard Navigation
```
- Tab through all buttons
- Enter to trigger clicks
- Escape to close modal
- Arrow keys in video player
```

### Screen Reader
```
- Check alt text on thumbnails
- Verify button labels are descriptive
- Test modal announcements
```

## Integration with Backend

### Verify Backend Endpoints

```bash
# List videos
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:9000/api/videos

# Generate video
curl -X POST -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A beautiful sunset",
    "model": "fal-ai/veo3/fast",
    "duration_seconds": 5,
    "aspect_ratio": "16:9"
  }' \
  http://localhost:9000/api/generate-video

# Check status
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:9000/api/generate-video/{GENERATION_ID}
```

### Verify Webhook Flow

If using async mode (which is default for video):
1. Fal.ai generates video
2. Calls webhook: `POST {WEBHOOK_BASE_URL}/api/webhooks/fal/{generationId}`
3. Server processes completion
4. Client polling detects completion
5. Gallery updates

## Next Steps

After basic testing works:
1. Test with different browsers (Chrome, Firefox, Safari, Edge)
2. Test on mobile devices (iOS, Android)
3. Load test with multiple concurrent generations
4. Test with slow/unstable network
5. Test with different credit amounts
6. Verify analytics/logging works
7. Test with real users in staging environment

## Useful Commands

```bash
# Start dev server
cd client && npm run dev

# Check for TypeScript errors
npm run type-check

# Lint code
npm run lint

# Build for production
npm run build
```

## Support Resources

- **API Documentation**: `docs/API.md`
- **Backend Implementation**: `docs/VIDEO_IMPLEMENTATION_SUMMARY.md`
- **Model Schemas**: `docs/VIDEO_MODEL_SCHEMAS.md`
- **Client Implementation**: `docs/CLIENT_VIDEO_IMPLEMENTATION.md`
- **General Guide**: `AGENTS.md`

## Reporting Issues

When reporting issues, include:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Browser and version
5. Console errors (screenshot)
6. Network tab (screenshot)
7. User credits balance
8. Model and parameters used

---

**Last Updated**: Current implementation
**Status**: Ready for testing
**Contact**: Development team
