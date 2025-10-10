import { CombinedGallery } from "@/components/CombinedGallery";
import { ImageModal } from "@/components/ImageModal";
import { apiClient } from "@/lib/api";
import { QUERY_KEYS, createQueryOptions } from "@/lib/query-config";
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

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto">
        <CombinedGallery
          onImageClick={handleImageClick}
          generatedImages={imagesData || []}
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
