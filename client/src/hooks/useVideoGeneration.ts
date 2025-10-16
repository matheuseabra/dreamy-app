import { generateVideo, getVideoGenerationStatus } from "@/lib/video-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { toast } from "sonner";

interface GeneratedVideo {
  id: string;
  src: string;
  prompt: string;
  model: string;
  duration?: number;
  thumbnailUrl?: string;
}

type VideoGenerationResponse = {
  success: boolean;
  generation?: {
    id: string;
    status: string;
    video?: {
      id: string;
      url: string;
      thumbnailUrl?: string;
      duration_seconds?: number;
      width?: number;
      height?: number;
    };
  };
  error?: string;
  details?: string;
};

export const useVideoGeneration = () => {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("fal-ai/veo3/fast");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [durationSeconds, setDurationSeconds] = useState(5);
  const [fps, setFps] = useState(24);
  const [guidanceScale, setGuidanceScale] = useState(7);
  const [seed, setSeed] = useState<number | undefined>(undefined);
  const [enableSafetyChecker, setEnableSafetyChecker] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideosLocal, setGeneratedVideosLocal] = useState<GeneratedVideo[]>([]);
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);

  const queryClient = useQueryClient();

  const getModelDisplayName = (modelId: string) => {
    const modelMap: Record<string, string> = {
      "fal-ai/sora-2/text-to-video": "Sora 2",
      "fal-ai/veo3/fast": "Veo 3 Fast",
      "fal-ai/kling-video/v2.5-turbo/pro/text-to-video": "Kling v2.5 Turbo Pro",
      "fal-ai/wan-25-preview/text-to-video": "WAN 2.5 Preview",
    };
    return modelMap[modelId] || "AI Video Model";
  };

  const pollGenerationStatus = useCallback(async (generationId: string) => {
    try {
      const response = await getVideoGenerationStatus(generationId);

      if (!response.success || !response.generation) {
        throw new Error(response.error || "Failed to get generation status");
      }

      const { status, video, error } = response.generation;

      if (status === "completed" && video) {
        // Clear polling interval
        if (pollInterval) {
          clearInterval(pollInterval);
          setPollInterval(null);
        }

        // Add video to local state
        const newVideo: GeneratedVideo = {
          id: video.id,
          src: video.url,
          prompt: prompt,
          model: getModelDisplayName(selectedModel),
          duration: video.duration_seconds,
          thumbnailUrl: video.thumbnailUrl || undefined,
        };

        setGeneratedVideosLocal((prev) => [newVideo, ...prev]);
        setIsGenerating(false);
        toast.success("Video generated successfully!");
        setPrompt("");

        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ["videos"] });

        return true;
      } else if (status === "failed") {
        if (pollInterval) {
          clearInterval(pollInterval);
          setPollInterval(null);
        }
        setIsGenerating(false);
        toast.error(error || "Video generation failed");
        return true;
      }

      // Still processing, continue polling
      return false;
    } catch (error) {
      console.error("Polling error:", error);
      if (pollInterval) {
        clearInterval(pollInterval);
        setPollInterval(null);
      }
      setIsGenerating(false);
      toast.error("Failed to check generation status");
      return true;
    }
  }, [pollInterval, prompt, selectedModel, queryClient]);

  const generateVideoMutation = useMutation<VideoGenerationResponse, Error, void>({
    mutationFn: async (): Promise<VideoGenerationResponse> => {
      const requestData: any = {
        prompt,
        model: selectedModel,
        aspect_ratio: aspectRatio,
        duration_seconds: durationSeconds,
        fps,
        guidance_scale: guidanceScale,
        enable_safety_checker: enableSafetyChecker,
        sync_mode: false, // Always async for video
      };

      if (negativePrompt.trim()) {
        requestData.negative_prompt = negativePrompt;
      }

      if (seed !== undefined) {
        requestData.seed = seed;
      }

      const data = await generateVideo(requestData);
      return data as VideoGenerationResponse;
    },
    onMutate: async () => {
      setIsGenerating(true);
    },
    onError: (error: Error) => {
      console.error("Generation error:", error);
      setIsGenerating(false);
      const message = error instanceof Error && error.message ? error.message : String(error);

      if (message.includes("Rate limit")) {
        toast.error("Rate limit exceeded. Please wait a moment and try again.");
      } else if (message.includes("Credits") || message.includes("credit")) {
        toast.error("Insufficient credits. Please add credits to continue.");
      } else {
        toast.error(message || "Failed to generate video. Please try again.");
      }
    },
    onSuccess: async (data) => {
      if (!data?.success || !data?.generation) {
        toast.error(data?.error || "No generation data received from server");
        setIsGenerating(false);
        return;
      }

      const { id, status } = data.generation;

      // If completed immediately (sync mode or very fast)
      if (status === "completed" && data.generation.video) {
        const video = data.generation.video;
        const newVideo: GeneratedVideo = {
          id: video.id,
          src: video.url,
          prompt: prompt,
          model: getModelDisplayName(selectedModel),
          duration: video.duration_seconds,
          thumbnailUrl: video.thumbnailUrl || undefined,
        };

        setGeneratedVideosLocal((prev) => [newVideo, ...prev]);
        setIsGenerating(false);
        toast.success("Video generated successfully!");
        setPrompt("");
        queryClient.invalidateQueries({ queryKey: ["videos"] });
        return;
      }

      // Start polling for async generation
      toast.info("Video generation started. This may take a few minutes...");

      const interval = setInterval(async () => {
        const isComplete = await pollGenerationStatus(id);
        if (isComplete && interval) {
          clearInterval(interval);
        }
      }, 5000); // Poll every 5 seconds

      setPollInterval(interval);
    },
  });

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    if (durationSeconds < 1 || durationSeconds > 30) {
      toast.error("Duration must be between 1 and 30 seconds");
      return;
    }

    generateVideoMutation.mutate();
  };

  // Cleanup polling on unmount
  const cleanup = useCallback(() => {
    if (pollInterval) {
      clearInterval(pollInterval);
      setPollInterval(null);
    }
  }, [pollInterval]);

  return {
    prompt,
    setPrompt,
    negativePrompt,
    setNegativePrompt,
    selectedModel,
    setSelectedModel,
    aspectRatio,
    setAspectRatio,
    durationSeconds,
    setDurationSeconds,
    fps,
    setFps,
    guidanceScale,
    setGuidanceScale,
    seed,
    setSeed,
    enableSafetyChecker,
    setEnableSafetyChecker,
    isGenerating,
    handleGenerate,
    generatedVideosLocal,
    setGeneratedVideosLocal,
    cleanup,
  };
};
