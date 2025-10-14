import { CombinedGallery } from "@/components/CombinedGallery";
import { ImageModal } from "@/components/ImageModal";
import { PromptBar } from "@/components/PromptBar";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { apiClient } from "@/lib/api";
import { QUERY_KEYS, createQueryOptions } from "@/lib/query-config";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface GeneratedImage {
  id: string;
  src: string;
  prompt: string;
  model: string;
}

const Dashboard = () => {
  const {
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
  } = useImageGeneration();

  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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

  useEffect(() => {
    if (imagesData && imagesData.length > 0)
      setGeneratedImagesLocal(imagesData);
  }, [imagesData, setGeneratedImagesLocal]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setModalOpen(true);
  };

  return (
    <div className="relative min-h-screen">
      <div className="container mx-auto">
        {/* <div className="mt-12 mb-6 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">What are you dreaming of?</h1>
        </div> */}
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

      <div className="fixed w-full max-w-3xl z-99 bottom-2 mx-auto right-0 left-[240px]">
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
          sourceImageUrl={sourceImageUrl}
          onSourceImageChange={handleSourceImageChange}
          strength={strength}
          onStrengthChange={handleStrengthChange}
        />
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
