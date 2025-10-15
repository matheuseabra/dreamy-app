import { CombinedGallery } from "@/components/CombinedGallery";
import { ImageModal } from "@/components/ImageModal";
import { useGallery } from "@/hooks/api";
import { useState } from "react";

interface GeneratedImage {
  id: string;
  src: string;
  prompt: string;
  model: string;
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
      }))
    : [];

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto mt-4">
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
