import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Heart, Share2, Trash2, X } from "lucide-react";
import { useState } from "react";

interface VideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  video: {
    id: string;
    src: string;
    prompt: string;
    model: string;
    duration?: number;
    thumbnailUrl?: string;
  } | null;
}

export const VideoModal = ({ open, onOpenChange, video }: VideoModalProps) => {
  const [isFavorited, setIsFavorited] = useState(false);

  if (!video) return null;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = video.src;
    link.download = `video-${video.id}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Generated Video",
          text: video.prompt,
          url: video.src,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(video.src);
      alert("Link copied to clipboard!");
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    // TODO: Implement API call to update favorite status
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this video?")) {
      // TODO: Implement API call to delete video
      onOpenChange(false);
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden border border-none">
        <div className="relative">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Video player */}
          <div className="relative bg-black">
            <video
              src={video.src}
              controls
              autoPlay
              className="w-full max-h-[70vh] object-contain"
              poster={video.thumbnailUrl}
            />
          </div>

          {/* Info section */}
          <div className="p-6 space-y-4">
            <DialogHeader>
              <DialogTitle className="text-md font-medium">{video.prompt}</DialogTitle>
              <DialogDescription className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">{video.model}</span>
                {video.duration && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      {formatDuration(video.duration)}
                    </span>
                  </>
                )}
              </DialogDescription>
            </DialogHeader>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleFavorite}
                className={`flex items-center gap-2 ${
                  isFavorited ? "text-red-500 border-red-500" : ""
                }`}
              >
                <Heart
                  className="h-4 w-4"
                  fill={isFavorited ? "currentColor" : "none"}
                />
                {isFavorited ? "Favorited" : "Favorite"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="flex items-center gap-2 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground ml-auto"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
