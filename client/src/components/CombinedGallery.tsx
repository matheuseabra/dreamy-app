import { ImageCard } from "./ImageCard";
import { ImageGallery } from "./ImageGallery";

interface CombinedGalleryProps {
  onImageClick: (image) => void;
  generatedImages: Array<{
    id: string;
    src: string;
    prompt: string;
    model: string;
  }>;
  isLoading?: boolean;
}

export const CombinedGallery = ({ onImageClick, generatedImages, isLoading }: CombinedGalleryProps) => {
  const allImages = [...generatedImages];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold">
            {isLoading ? "Loading..." : generatedImages.length > 0 ? "Your Generations" : "No Generations"}
          </h3>
          {generatedImages.length > 0 && !isLoading && (
            <p className="text-sm text-muted-foreground mt-1">
              {generatedImages.length} saved image{generatedImages.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-square bg-gray-100 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : generatedImages.length === 0 ? (
        // When the API returns no images, show the mock ImageGallery to help users get started
        <ImageGallery onImageClick={() => {}} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-3">
          {allImages.map((image) => (
            <ImageCard
              key={image.id}
              src={image.src}
              prompt={image.prompt}
              model={image.model}
              onClick={() => onImageClick(image)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
