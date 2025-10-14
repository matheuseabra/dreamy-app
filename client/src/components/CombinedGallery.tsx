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
    <div className="w-full mt-12">
      {/* <div className="flex items-center justify-between mb-6">
        <div>
          {generatedImages.length > 0 && !isLoading && (
            <p className="text-sm text-muted-foreground mt-1">
              {generatedImages.length} saved image{generatedImages.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div> */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-1">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="aspect-square bg-muted/20 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : generatedImages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[400px] border border-dashed border-muted-foreground/20 rounded-lg">
          <div className="h-12 w-12 text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5z" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">No images generated yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-1">
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
