import { Image } from "lucide-react";
import { ImageCard } from "./ImageCard";

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
            <Image className="h-12 w-12" />
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
