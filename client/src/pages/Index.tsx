import { CombinedGallery } from "@/components/CombinedGallery";
import DashboardHeader from "@/components/DashboardHeader";
import { GenerationSettings } from "@/components/GenerationSettings";
import { ImageModal } from "@/components/ImageModal";
import { ModelSelector } from "@/components/ModelSelector";
import { PromptInput } from "@/components/PromptInput";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { config } from "../config";

interface GeneratedImage {
  id: string;
  src: string;
  prompt: string;
  model: string;
}

type ServerResponse = {
  imageUrl: string;
  prompt?: string;
  model?: string;
};

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("dalle");
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
    queryKey: ["getImages"],
    queryFn: async () => {
      let data = null;
      let error = null;

      try {
        const res = await fetch(`${config.API_URL}/api/images`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(
            text || "Failed to fetch generated images from server"
          );
        }

        const json = await res.json();
        data = Array.isArray(json) ? json : [];
      } catch (e) {
        error = e as Error;
      }

      if (error) throw error;

      if (!data) return [];

      const formattedImages: GeneratedImage[] = data.map((img) => ({
        id: img.id,
        src: img.image_url,
        prompt: img.prompt,
        model: img.model,
      }));

      return formattedImages;
    },
  });

  // sync local cache when query data arrives
  useEffect(() => {
    if (imagesData && imagesData.length > 0)
      setGeneratedImagesLocal(imagesData);
  }, [imagesData]);

  console.log(imagesData);

  const queryClient = useQueryClient();

  const generateImageMutation = useMutation<ServerResponse, Error, void>({
    mutationFn: async (): Promise<ServerResponse> => {
      // Call the server express endpoint
      const res = await fetch(`${config.API_URL}/api/generate-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          model: selectedModel,
          size,
          quality,
          style,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Server error while generating image");
      }

      const data = await res.json();
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
      if (!data?.imageUrl) {
        toast.error("No image URL received from server");
        return;
      }

      const newImage: GeneratedImage = {
        id: data.imageUrl,
        src: data.imageUrl,
        prompt: data.prompt || prompt,
        model: data.model || getModelDisplayName(selectedModel),
      };

      // Save to database
      try {
        const { data: savedImage, error: dbError } = await supabase
          .from("generated_images")
          .insert({
            image_url: data.imageUrl,
            prompt: data.prompt || prompt,
            model: data.model || getModelDisplayName(selectedModel),
            size,
            quality,
            style,
          })
          .select()
          .single();

        if (dbError) {
          console.error("Database error:", dbError);
          toast.error("Image generated but couldn't save to database");
        } else {
          newImage.id = savedImage.id;
        }
      } catch (dbErr) {
        console.error("Database save exception:", dbErr);
        toast.error("Image generated but couldn't save to database");
      }

      setGeneratedImagesLocal((prev) => [newImage, ...prev]);
      toast.success("Image generated and saved successfully!");
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
      dalle: "DALL-E 3",
      midjourney: "Midjourney v6",
      stable: "Stable Diffusion XL",
      flux: "Flux Pro",
    };
    return modelMap[modelId] || "AI Model";
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <DashboardHeader />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Sidebar - Controls */}
          <aside className="lg:col-span-1 space-y-6 animate-fade-in">
            <div className="lg:sticky lg:top-24 space-y-6 scrollbar-thin">
              {/* Generation Settings */}
              <div className="border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <h3 className="text-lg font-semibold mb-4">Image Settings</h3>
                <ModelSelector
                  selectedModel={selectedModel}
                  onSelect={setSelectedModel}
                />
                <br />
                <GenerationSettings
                  size={size}
                  quality={quality}
                  style={style}
                  onSizeChange={setSize}
                  onQualityChange={setQuality}
                  onStyleChange={setStyle}
                />
                <br />
                <PromptInput
                  value={prompt}
                  onChange={setPrompt}
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                />
              </div>
            </div>
          </aside>

          {/* Main Content - Gallery */}
          <main className="lg:col-span-2 animate-slide-up">
            <div className="border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 scrollbar-thin">
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
          </main>
        </div>
      </div>

      {/* Image Detail Modal */}
      <ImageModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        image={selectedImage}
      />
    </div>
  );
};

export default Index;
