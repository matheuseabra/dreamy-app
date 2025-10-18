import { apiClient } from "@/lib/api";
import { ApiError } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

interface GeneratedImage {
  id: string;
  src: string;
  prompt: string;
  model: string;
}

type ServerResponse = {
  success: boolean;
  // When generation fails the server may return an error message in the payload:
  // { success: false, error: "Insufficient credits for video generation" }
  error?: string;
  details?: string;
  // generation is optional when success is false
  generation?: {
    id: string;
    status: string;
    // images may be absent in some responses (e.g. failure cases)
    images?: Array<{
      id: string;
      url: string;
      width?: number;
      height?: number;
    }>;
  };
};

export const useImageGeneration = () => {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("fal-ai/flux/schnell");
  const [size, setSize] = useState("square");
  const [quality, setQuality] = useState("hd");
  const [style, setStyle] = useState("vivid");
  const [sourceImageUrl, setSourceImageUrl] = useState<string | null>(null);
  const [strength, setStrength] = useState(0.8);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImagesLocal, setGeneratedImagesLocal] = useState<
    GeneratedImage[]
  >([]);
  const [showPricingDialog, setShowPricingDialog] = useState(false);
  const [requiredCredits, setRequiredCredits] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const getModelDisplayName = (modelId: string) => {
    const modelMap: Record<string, string> = {
      "fal-ai/flux/dev": "Flux Dev",
      "fal-ai/flux/schnell": "Flux Schnell",
      "fal-ai/flux/dev/image-to-image": "Flux Dev I2I",
      "fal-ai/flux-1/schnell/redux": "Flux Schnell Redux",
      "fal-ai/flux-pro/kontext": "Flux Pro Kontext",
      "fal-ai/flux-pro/kontext/max": "Flux Pro Kontext Max",
      "fal-ai/flux-kontext/dev": "Flux Kontext Dev",
      "fal-ai/flux-kontext-lora": "Flux Kontext LoRA",
      "fal-ai/recraft/v3/text-to-image": "Recraft V3 T2I",
      "fal-ai/recraft/v3/image-to-image": "Recraft V3 I2I",
      "fal-ai/ideogram/v2": "Ideogram V2",
      "fal-ai/ideogram/v3": "Ideogram V3",
      "fal-ai/nano-banana": "Nano Banana",
      "fal-ai/wan/v2.2-5b/text-to-image": "WAN V2.2",
    };
    return modelMap[modelId] || "AI Model";
  };

  const generateImageMutation = useMutation<ServerResponse, Error, void>({
    mutationFn: async (): Promise<ServerResponse> => {
      const requestData: any = {
        prompt,
        model: selectedModel,
        image_size: size,
        quality,
        style,
        sync_mode: true,
        num_images: 1,
      };

      // Add image-to-image specific parameters
      if (sourceImageUrl) {
        requestData.image_url = sourceImageUrl;
        requestData.strength = strength;
      }

      const data = await apiClient.post("/api/generate", requestData);
      return data as ServerResponse;
    },
    onMutate: async () => {
      setIsGenerating(true);
    },
    onError: (error: Error) => {
      console.error("Generation error:", error);
      const message =
        error instanceof Error && error.message ? error.message : String(error);
      // Open pricing dialog when credits are insufficient (HTTP 402 or message match)
      if (
        (error instanceof ApiError && error.status === 402) ||
        /insufficient credits/i.test(message) ||
        /credit/i.test(message)
      ) {
        // Try to extract required credits from error body if available
        let needed: number | null = null;
        const body: any = (error as any)?.body;
        try {
          if (typeof body === "string") {
            const parsed = JSON.parse(body);
            const val =
              parsed?.requiredCredits ??
              parsed?.required_credits ??
              parsed?.data?.requiredCredits;
            if (typeof val === "number") needed = val;
          } else if (body && typeof body === "object") {
            const val =
              body?.requiredCredits ??
              body?.required_credits ??
              body?.data?.requiredCredits;
            if (typeof val === "number") needed = val;
          }
        } catch {
          // ignore parse errors
        }
        setRequiredCredits(needed);
        setShowPricingDialog(true);
        return;
      }
      if (message.includes("Rate limit")) {
        toast.error("Rate limit exceeded. Please wait a moment and try again.");
      } else {
        toast.error(message || "Failed to generate image. Please try again.");
      }
    },
    onSuccess: async (data) => {
      // Handle server responses that explicitly report failure via success:false
      // Example server response: { success: false, error: "Insufficient credits for video generation" }
      if (data && data.success === false) {
        const errMsg = (data.error || "").toString();
        if (/insufficient credits/i.test(errMsg)) {
          // Open pricing dialog when the server explicitly reports insufficient credits.
          // The response shape in this case doesn't include requiredCredits, so leave undefined.
          setRequiredCredits(null);
          setShowPricingDialog(true);
          setIsGenerating(false);
          return;
        }
        // Fallback for other server-reported errors
        toast.error(errMsg || "No images received from server");
        setIsGenerating(false);
        return;
      }

      if (!data?.generation?.images?.length) {
        toast.error("No images received from server");
        return;
      }

      const firstImage = data.generation.images[0];
      const newImage: GeneratedImage = {
        id: firstImage.id,
        src: firstImage.url,
        prompt: prompt,
        model: getModelDisplayName(selectedModel),
      };

      setGeneratedImagesLocal((prev) => [newImage, ...prev]);
      toast.success("Image generated successfully!");
      setPrompt("");
    },
    onSettled: () => {
      setIsGenerating(false);
      queryClient.invalidateQueries({ queryKey: ["generated_images"] });
    },
  });

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    // Check if image-to-image model requires source image
    const isImageToImageModel =
      selectedModel.includes("image-to-image") ||
      selectedModel.includes("character");
    if (isImageToImageModel && !sourceImageUrl) {
      toast.error("Please upload a source image for image-to-image generation");
      return;
    }

    generateImageMutation.mutate();
  };

  const handleSourceImageChange = (url: string | null) => {
    setSourceImageUrl(url);
  };

  const handleStrengthChange = (value: number) => {
    setStrength(value);
  };

  return {
    prompt,
    setPrompt,
    selectedModel,
    setSelectedModel,
    size,
    setSize,
    quality,
    setQuality,
    style,
    setStyle,
    sourceImageUrl,
    handleSourceImageChange,
    strength,
    handleStrengthChange,
    isGenerating,
    handleGenerate,
    generatedImagesLocal,
    setGeneratedImagesLocal,
    showPricingDialog,
    setShowPricingDialog,
    requiredCredits,
  };
};
