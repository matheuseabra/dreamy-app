import { CombinedGallery } from "@/components/CombinedGallery";
import { ImageModal } from "@/components/ImageModal";
import { PromptBar } from "@/components/PromptBar";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { useGallery } from "@/hooks/api";
import { useEffect, useMemo, useState } from "react";

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

  // Use the new useGallery hook
  const { data: galleryImages, isLoading: imagesLoading } = useGallery();

  // Transform gallery images to match GeneratedImage interface
  const transformedImages: GeneratedImage[] = useMemo(
    () =>
      galleryImages
        ? galleryImages.map((img) => ({
            id: img.id,
            src: img.url || "",
            prompt: img.prompt || "No prompt available",
            model: img.model || "Unknown",
          }))
        : [],
    [galleryImages]
  );

  useEffect(() => {
    if (transformedImages.length > 0) {
      setGeneratedImagesLocal(transformedImages);
    }
  }, [transformedImages, setGeneratedImagesLocal]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setModalOpen(true);
  };

  return (
    <div className="relative min-h-screen">
      <div className="container mx-auto">
        <CombinedGallery
          onImageClick={handleImageClick}
          generatedImages={
            generatedImagesLocal.length > 0
              ? generatedImagesLocal
              : transformedImages
          }
          isLoading={imagesLoading}
          isGenerating={isGenerating}
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
