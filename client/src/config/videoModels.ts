import { Film, Video, Zap, Sparkles } from "lucide-react";
import gptImageThumb from "@/assets/gpt-image-1-thumb.webp";

export const VIDEO_MODELS = [
  {
    id: "fal-ai/sora-2/text-to-video",
    name: "Sora 2",
    description: "Premium quality text-to-video (50 credits/sec)",
    type: "text-to-video",
    icon: Sparkles,
    creditsPerSecond: 50,
    thumb: gptImageThumb,
  },
  {
    id: "fal-ai/veo3/fast",
    name: "Veo 3 Fast",
    description: "Fast and cost-effective video generation (10 credits/sec)",
    type: "text-to-video",
    icon: Zap,
    creditsPerSecond: 10,
    thumb: gptImageThumb,
  },
  {
    id: "fal-ai/kling-video/v2.5-turbo/pro/text-to-video",
    name: "Kling v2.5 Turbo Pro",
    description: "Professional quality video (25 credits/sec)",
    type: "text-to-video",
    icon: Video,
    creditsPerSecond: 25,
    thumb: gptImageThumb,
  },
  {
    id: "fal-ai/wan-25-preview/text-to-video",
    name: "WAN 2.5 Preview",
    description: "Preview model for video generation (12 credits/sec)",
    type: "text-to-video",
    icon: Film,
    creditsPerSecond: 12,
    thumb: gptImageThumb,
  },
  {
    id: "fal-ai/minimax/hailuo-02/standard/text-to-video",
    name: "Hailuo 02 Standard",
    description: "Standard quality text-to-video (15 credits/sec)",
    type: "text-to-video",
    icon: Video,
    creditsPerSecond: 15,
    thumb: gptImageThumb,
  },
  {
    id: "fal-ai/kandinsky5/text-to-video",
    name: "Kandinsky 5",
    description: "High-quality text-to-video (20 credits/sec)",
    type: "text-to-video",
    icon: Video,
    creditsPerSecond: 20,
    thumb: gptImageThumb,
  },
  {
    id: "fal-ai/minimax/hailuo-02/pro/text-to-video",
    name: "Hailuo 02 Pro",
    description: "Professional quality text-to-video (25 credits/sec)",
    type: "text-to-video",
    icon: Video,
    creditsPerSecond: 25,
    thumb: gptImageThumb,
  }
];
