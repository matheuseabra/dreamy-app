import { CombinedGallery } from "@/components/CombinedGallery";
import { ImageModal } from "@/components/ImageModal";
import { PromptBar } from "@/components/PromptBar";
import { apiClient } from "@/lib/api";
import { QUERY_KEYS, createQueryOptions } from "@/lib/query-config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface GeneratedImage {
  id: string;
  src: string;
  prompt: string;
  model: string;
}

type ServerResponse = {
  success: boolean;
  generation: {
    id: string;
    status: string;
    images: Array<{
      id: string;
      url: string;
      width: number;
      height: number;
    }>;
  };
};

const Dashboard = () => {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("fal-ai/flux/schnell");
  const [size, setSize] = useState("square");
  const [quality, setQuality] = useState("hd");
  const [style, setStyle] = useState("vivid");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [generatedImagesLocal, setGeneratedImagesLocal] = useState<
    GeneratedImage[]
  >([]);

  const { data: imagesData, isLoading: imagesLoading } = useQuery<
    GeneratedImage[],
    Error
  >({
    queryKey: QUERY_KEYS.images,
    queryFn: async () => {
      try {
        const response = await apiClient.get("/api/gallery");
        const images = response.images || [];
        return images.map((img) => ({
          id: img.id,
          src: img.url,
          prompt: img.prompt,
          model: img.model,
        }));
      } catch (error) {
        throw new Error(
          error instanceof Error
            ? error.message
            : "Failed to fetch generated images from server"
        );
      }
    },
    ...createQueryOptions(),
  });

  // sync local cache when query data arrives
  useEffect(() => {
    if (imagesData && imagesData.length > 0)
      setGeneratedImagesLocal(imagesData);
  }, [imagesData]);

  const queryClient = useQueryClient();

  const generateImageMutation = useMutation<ServerResponse, Error, void>({
    mutationFn: async (): Promise<ServerResponse> => {
      const data = await apiClient.post("/api/generate", {
        prompt,
        model: selectedModel,
        image_size: size,
        quality,
        style,
        sync_mode: true,
        num_images: 1,
      });
      return data as ServerResponse;
    },
    onMutate: async () => {
      setIsGenerating(true);
      toast.info("Starting image generation...");
    },
    onError: (error: Error) => {
      console.error("Generation error:", error);
      const message =
        error instanceof Error && error.message ? error.message : String(error);
      if (message.includes("Rate limit")) {
        toast.error("Rate limit exceeded. Please wait a moment and try again.");
      } else if (message.includes("Credits")) {
        toast.error("Credits exhausted. Please add credits to continue.");
      } else {
        toast.error(message || "Failed to generate image. Please try again.");
      }
    },
    onSuccess: async (data) => {
      if (!data?.success || !data?.generation?.images?.length) {
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
      // Optionally invalidate queries if there was a query for images
      queryClient.invalidateQueries({ queryKey: ["generated_images"] });
    },
  });

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    generateImageMutation.mutate();
  };

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

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setModalOpen(true);
  };

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold">What are you dreaming of?</h1>
        </div>
        <div className="mb-6">
          <PromptBar
            prompt={prompt}
            onPromptChange={setPrompt}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            size={size}
            onSizeChange={setSize}
            quality={quality}
            onQualityChange={setQuality}
            style={style}
            onStyleChange={setStyle}
          />
        </div>
        <div className="p-6 shadow-sm hover:shadow-md transition-shadow duration-200 scrollbar-thin">
          <CombinedGallery
            onImageClick={handleImageClick}
            generatedImages={
              generatedImagesLocal.length > 0
                ? generatedImagesLocal
                : imagesData || []
            }
            isLoading={imagesLoading}
          />
        </div>
      </div>
      <ImageModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        image={selectedImage}
      />
    </div>
  );
};

export default Dashboard;
