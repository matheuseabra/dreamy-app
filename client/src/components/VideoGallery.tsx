import { Video } from "lucide-react";
import { VideoCard } from "./VideoCard";

interface VideoGalleryProps {
  onVideoClick: (video: any) => void;
  generatedVideos: Array<{
    id: string;
    src: string;
    prompt: string;
    model: string;
    duration?: number;
    thumbnailUrl?: string;
  }>;
  isLoading?: boolean;
  isGenerating?: boolean;
  currentPrompt?: string;
}

export const VideoGallery = ({
  onVideoClick,
  generatedVideos,
  isLoading,
  isGenerating,
  currentPrompt,
}: VideoGalleryProps) => {
  return (
    <div className="w-full mt-12">
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="aspect-video bg-muted/20 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : generatedVideos.length === 0 && !isGenerating ? (
        <div className="flex flex-col items-center justify-center h-[400px] border border-dashed border-muted-foreground/20 rounded-lg">
          <div className="h-12 w-12 text-muted-foreground">
            <Video className="h-12 w-12" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            No videos generated yet
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Optimistic loading skeleton - shown first */}
          {isGenerating && (
            <div className="aspect-video bg-muted/20 rounded-lg relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-muted/40 to-transparent animate-shimmer"
                style={{
                  backgroundSize: "200% 100%",
                  animation: "shimmer 2s infinite",
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <div className="w-8 h-8 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin mb-2" />
                {currentPrompt && (
                  <p className="text-xs text-muted-foreground/70 line-clamp-2 mt-2">
                    {currentPrompt}
                  </p>
                )}
                <p className="text-xs text-muted-foreground/50 mt-2">
                  Generating video... This may take a few minutes
                </p>
              </div>
            </div>
          )}

          {generatedVideos.map((video) => (
            <VideoCard
              key={video.id}
              src={video.src}
              thumbnailUrl={video.thumbnailUrl}
              prompt={video.prompt}
              model={video.model}
              duration={video.duration}
              onClick={() => onVideoClick(video)}
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
