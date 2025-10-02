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
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-square bg-gray-100 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : generatedImages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 3v4M8 3v4M3 11h18" />
            <rect x="7" y="13" width="10" height="6" rx="1" ry="1" />
          </svg>
          <h4 className="mt-4 text-lg font-medium text-foreground">No saved images yet</h4>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">When you generate images they will appear here. Start by entering a prompt and creating your first generation.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
