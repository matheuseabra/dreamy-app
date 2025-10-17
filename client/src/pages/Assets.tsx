import { CombinedGallery } from "@/components/CombinedGallery";
import { ImageModal } from "@/components/ImageModal";
import { useGallery } from "@/hooks/api";
import { Folder } from "lucide-react";
import { useState } from "react";

interface GeneratedImage {
  id: string;
  src: string;
  prompt: string;
  model: string;
  isFavorited?: boolean;
}

const Assets = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Use the new useGallery hook
  const { data: galleryImages, isLoading: imagesLoading } = useGallery();

  // Transform gallery images to match GeneratedImage interface
  const transformedImages: GeneratedImage[] = galleryImages
    ? galleryImages.map((img) => ({
        id: img.id,
        src: img.url || "",
        prompt: img.prompt || "No prompt available",
        model: img.model || "Unknown",
        ...img
      }))
    : [];

  const handleImageClick = (image) => {
    // Transform to include all necessary data for modal
    const modalImage = {
      id: image.id,
      src: image.src,
      prompt: image.prompt,
      model: image.model,
      isFavorited: image?.is_favorited,
    };
    setSelectedImage(modalImage);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto mt-4">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Folder className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Assets</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {transformedImages && transformedImages.length > 0
              ? `${transformedImages.length} ${transformedImages.length === 1 ? 'asset' : 'assets'}`
              : 'No assets yet'}
          </p>
        </div>
        <CombinedGallery
          onImageClick={handleImageClick}
          generatedImages={transformedImages}
          isLoading={imagesLoading}
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

export default Assets;
