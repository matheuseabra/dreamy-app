import { CombinedGallery } from "@/components/CombinedGallery";
import { ImageModal } from "@/components/ImageModal";
import { useFavorites } from "@/hooks/api/useGallery";
import { Star } from "lucide-react";
import { useState } from "react";

interface GeneratedImage {
  id: string;
  src: string;
  prompt: string;
  model: string;
  isFavorited?: boolean;
}

const Favorites = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Use the useFavorites hook
  const { data: favoriteImages, isLoading: imagesLoading } = useFavorites();

  // Transform favorite images to match GeneratedImage interface
  const transformedImages: GeneratedImage[] = favoriteImages
    ? favoriteImages.map((img) => ({
        id: img.id,
        src: img.url || "",
        prompt: img.prompt || "No prompt available",
        model: img.model || "Unknown",
        isFavorited: img.is_favorited
      }))
    : [];

  const handleImageClick = (image: GeneratedImage) => {
    // Transform to include all necessary data for modal
    const modalImage = {
      id: image.id,
      src: image.src,
      prompt: image.prompt,
      model: image.model,
      isFavorited: image.isFavorited,
    };
    setSelectedImage(modalImage);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto mt-4">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
            <h1 className="text-2xl font-bold">Favorites</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {favoriteImages && favoriteImages.length > 0
              ? `${favoriteImages.length} favorited ${favoriteImages.length === 1 ? 'image' : 'images'}`
              : 'No favorite images yet'}
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

export default Favorites;
