/**
 * client/src/hooks/useVideoGeneration.ts
 *
 * Hook for handling video generation flows on the client.
 * - Mirrors logic used in useImageGeneration for consistent insufficient-credit behavior.
 * - Opens PricingDialog on either:
 *    a) thrown ApiError with HTTP 402, or
 *    b) successful HTTP response with `{ success: false, error: "Insufficient credits..." }`
 *
 * Exposes `showPricingDialog`, `setShowPricingDialog`, and `requiredCredits` so pages can render the dialog.
 */

import { generateVideo, getVideoGenerationStatus } from "@/lib/video-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api-client";

interface GeneratedVideo {
  id: string;
  src: string;
  prompt: string;
  model: string;
  duration?: number;
  thumbnailUrl?: string;
  aspectRatio?: string;
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
      aspectRatio?: string;
    };
    error?: string;
    message?: string;
  };
  error?: string;
  details?: string;
  // optional numeric field servers may include for required credits
  requiredCredits?: number;
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
  const [generatedVideosLocal, setGeneratedVideosLocal] = useState<GeneratedVideo[]>(
    []
  );
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);

  // Pricing dialog state exposed to the consumer
  const [showPricingDialog, setShowPricingDialog] = useState(false);
  const [requiredCredits, setRequiredCredits] = useState<number | undefined>(
    undefined
  );

  const queryClient = useQueryClient();

  const getModelDisplayName = (modelId: string) => {
    const modelMap: Record<string, string> = {
      "fal-ai/sora-2/text-to-video": "Sora 2",
      "fal-ai/veo3/fast": "Veo 3 Fast",
      "fal-ai/kling-video/v2.5-turbo/pro/text-to-video": "Kling v2.5 Turbo Pro",
      "fal-ai/wan-25-preview/text-to-video": "WAN 2.5 Preview",
      "fal-ai/minimax/hailuo-02/standard/text-to-video": "Hailuo 02 Standard",
      "fal-ai/kandinsky5/text-to-video": "Kandinsky 5",
    };
    return modelMap[modelId] || "AI Video Model";
  };

  const tryParseRequiredCreditsFromBody = (body: any): number | undefined => {
    if (!body) return undefined;
    try {
      if (typeof body === "string") {
        const parsed = JSON.parse(body);
        return (
          parsed?.requiredCredits ??
          parsed?.required_credits ??
          parsed?.data?.requiredCredits ??
          parsed?.data?.required_credits
        );
      } else if (typeof body === "object") {
        return (
          body?.requiredCredits ??
          body?.required_credits ??
          body?.data?.requiredCredits ??
          body?.data?.required_credits
        );
      }
    } catch {
      // ignore JSON parse errors
    }
    return undefined;
  };

  const pollGenerationStatus = useCallback(
    async (generationId: string) => {
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
            aspectRatio: video.aspectRatio || undefined,
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
      } catch (err) {
        console.error("Polling error:", err);
        if (pollInterval) {
          clearInterval(pollInterval);
          setPollInterval(null);
        }
        setIsGenerating(false);
        toast.error("Failed to check generation status");
        return true;
      }
    },
    [pollInterval, prompt, selectedModel, queryClient]
  );

  const generateVideoMutation = useMutation<
    VideoGenerationResponse,
    Error,
    void
  >({
    mutationFn: async (): Promise<VideoGenerationResponse> => {
      const requestData: any = {
        prompt,
        model: selectedModel,
        aspect_ratio: aspectRatio,
        duration_seconds: durationSeconds,
        fps,
        guidance_scale: guidanceScale,
        enable_safety_checker: enableSafetyChecker,
        sync_mode: false, // videos are async
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
      const message =
        error instanceof Error && error.message ? error.message : String(error);

      // Thrown 402 or text that mentions credits -> open dialog
      if (
        (error instanceof ApiError && (error as ApiError).status === 402) ||
        /insufficient credits/i.test(message) ||
        /credit/i.test(message)
      ) {
        // Try to extract required credits from thrown error body if available
        const needed = tryParseRequiredCreditsFromBody((error as any)?.body);
        setRequiredCredits(needed);
        setShowPricingDialog(true);
        return;
      }

      if (message.includes("Rate limit")) {
        toast.error("Rate limit exceeded. Please wait a moment and try again.");
      } else {
        toast.error(message || "Failed to generate video. Please try again.");
      }
    },
    onSuccess: async (data) => {
      // Handle server responses that explicitly report failure via success:false
      // Example: { success: false, error: "Insufficient credits for video generation" }
      if (data && data.success === false) {
        const errMsg = (data.error || "").toString();

        // If server explicitly indicates insufficient credits, open the pricing dialog
        if (/insufficient credits/i.test(errMsg)) {
          // Some server payloads may include requiredCredits in the JSON body
          const needed =
            data.requiredCredits ??
            // try to parse details if it contains JSON
            ((): number | undefined => {
              try {
                if (data.details) {
                  const parsed = JSON.parse(data.details);
                  return (
                    parsed?.requiredCredits ??
                    parsed?.required_credits ??
                    parsed?.data?.requiredCredits
                  );
                }
              } catch {
                // ignore
              }
              return undefined;
            })();

          setRequiredCredits(needed);
          setShowPricingDialog(true);
          setIsGenerating(false);
          return;
        }

        // Fallback: show server-provided error
        toast.error(errMsg || "No generation data received from server");
        setIsGenerating(false);
        return;
      }

      if (!data?.generation) {
        toast.error("No generation data received from server");
        setIsGenerating(false);
        return;
      }

      const { id, status } = data.generation;

      // If completed immediately (unlikely for video, but handle just in case)
      if (status === "completed" && data.generation.video) {
        const video = data.generation.video;
        const newVideo: GeneratedVideo = {
          id: video.id,
          src: video.url,
          prompt: prompt,
          model: getModelDisplayName(selectedModel),
          duration: video.duration_seconds,
          thumbnailUrl: video.thumbnailUrl || undefined,
          aspectRatio: video.aspectRatio || undefined,
        };

        setGeneratedVideosLocal((prev) => [newVideo, ...prev]);
        setIsGenerating(false);
        toast.success("Video generated successfully!");
        setPrompt("");
        queryClient.invalidateQueries({ queryKey: ["videos"] });
        return;
      }

      // Start polling for async generation (in_queue or processing)
      toast.info("Video generation started. This may take a few minutes...");

      const interval = setInterval(async () => {
        const isComplete = await pollGenerationStatus(id);
        if (isComplete && interval) {
          clearInterval(interval);
        }
      }, 5000); // Poll every 5s

      setPollInterval(interval);
    },
    onSettled: () => {
      // Leave isGenerating=false to other handlers where appropriate;
      // we ensure it's false when operations complete or errors occur.
      queryClient.invalidateQueries({ queryKey: ["videos"] });
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

    // Fire the mutation — backend will determine if credits are sufficient
    generateVideoMutation.mutate();
  };

  // Cleanup polling on unmount / consumer can also call cleanup()
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
    // Pricing dialog controls for the consumer
    showPricingDialog,
    setShowPricingDialog,
    requiredCredits,
  };
};

export default useVideoGeneration;
