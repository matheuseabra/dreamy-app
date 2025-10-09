import { CombinedGallery } from "@/components/CombinedGallery";
import { ImageModal } from "@/components/ImageModal";
import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
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

  const { data: imagesData, isLoading: imagesLoading } = useQuery<
    GeneratedImage[],
    Error
  >({
    queryKey: ["getImages"],
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
  });

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-3">        
        <div className="border border-none rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 scrollbar-thin">
          <CombinedGallery
            onImageClick={handleImageClick}
            generatedImages={imagesData || []}
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

export default Assets;
