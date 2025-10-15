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
  isGenerating?: boolean;
  currentPrompt?: string;
}

export const CombinedGallery = ({ 
  onImageClick, 
  generatedImages, 
  isLoading,
  isGenerating,
  currentPrompt 
}: CombinedGalleryProps) => {
  const allImages = [...generatedImages];

  return (
    <div className="w-full mt-12">
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-1">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="aspect-square bg-muted/20 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : generatedImages.length === 0 && !isGenerating ? (
        <div className="flex flex-col items-center justify-center h-[400px] border border-dashed border-muted-foreground/20 rounded-lg">
          <div className="h-12 w-12 text-muted-foreground">
            <Image className="h-12 w-12" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">No images generated yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-1">
          {/* Optimistic loading skeleton - shown first */}
          {isGenerating && (
            <div className="aspect-square bg-muted/20 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-muted/40 to-transparent animate-shimmer" 
                   style={{
                     backgroundSize: '200% 100%',
                     animation: 'shimmer 2s infinite'
                   }} 
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <div className="w-8 h-8 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin mb-2" />
                {currentPrompt && (
                  <p className="text-xs text-muted-foreground/70 line-clamp-2 mt-2">
                    {currentPrompt}
                  </p>
                )}
              </div>
            </div>
          )}
          
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
      
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
};