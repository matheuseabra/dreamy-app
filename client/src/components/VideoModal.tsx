import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Copy, Download, Heart, Share2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
    createdAt?: string;
    aspectRatio?: string;
  } | null;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export const VideoModal = ({
  open,
  onOpenChange,
  video,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
}: VideoModalProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [showFullPrompt, setShowFullPrompt] = useState(false);

  if (!video) return null;

  // Detect portrait/vertical videos (9:16, 9:21, etc.)
  const isPortrait = video.aspectRatio
    ? video.aspectRatio.includes("9:16") ||
      video.aspectRatio.includes("9:21") ||
      video.aspectRatio.startsWith("9:") ||
      video.aspectRatio.includes("portrait")
    : false;

  const MAX_PROMPT_LENGTH = 200;
  const isTruncated = video.prompt.length > MAX_PROMPT_LENGTH;
  const displayPrompt =
    !showFullPrompt && isTruncated
      ? video.prompt.slice(0, MAX_PROMPT_LENGTH) + "..."
      : video.prompt;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(video.prompt);
    toast.success("Prompt copied to clipboard!");
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = video.src;
    link.download = `video-${video.id}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Video download started!");
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
      navigator.clipboard.writeText(video.src);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast.success(isFavorited ? "Removed from favorites" : "Added to favorites");
    // TODO: Implement API call to update favorite status
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this video?")) {
      // TODO: Implement API call to delete video
      toast.success("Video deleted");
      onOpenChange(false);
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  console.log({ video })
  console.log("isPortrait:", isPortrait);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl w-[95vw] h-[90vh] p-0 overflow-hidden border-0">
        <div className="flex">
          {/* Video Player Section */}
          <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
            {hasPrevious && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white border border-border backdrop-blur-sm"
                onClick={onPrevious}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}

            {hasNext && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white border border-border backdrop-blur-sm"
                onClick={onNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            )}

            <video
              src={video.src}
              controls
              autoPlay
              playsInline
              className={isPortrait ? "h-[650px] object-contain" : "w-full h-full object-contain"}
              poster={video.thumbnailUrl}
            />
          </div>

          {/* Right Sidebar */}
          <div className="w-80 bg-card border-l border-border flex flex-col">
            {/* Info Section */}
            <div className="flex-1 p-4 pt-12 space-y-6 overflow-y-auto scrollbar-thin">
              {/* Prompt */}
              <div className="space-y-2">
                <div
                  className={`flex items-start justify-between ${
                    showFullPrompt
                      ? "max-h-80 overflow-auto scrollbar-thin"
                      : "max-h-48 overflow-hidden"
                  }`}
                >
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {displayPrompt}
                    {isTruncated && (
                      <button
                        onClick={() => setShowFullPrompt(!showFullPrompt)}
                        className="text-primary underline ml-1"
                      >
                        {showFullPrompt ? "See less" : "See more"}
                      </button>
                    )}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground ml-2"
                    onClick={handleCopyPrompt}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Metadata */}
              <div className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                  <Badge
                    variant="secondary"
                    className="bg-primary/20 text-primary border-primary/30"
                  >
                    {video.model}
                  </Badge>
                  {video.aspectRatio && (
                    <Badge
                      variant="secondary"
                      className="bg-primary/20 text-primary border-primary/30"
                    >
                      {video.aspectRatio}
                    </Badge>
                  )}
                  {video.duration && (
                    <Badge
                      variant="secondary"
                      className="bg-primary/20 text-primary border-primary/30"
                    >
                      {formatDuration(video.duration)}
                    </Badge>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Creation Time</span>
                    <span className="text-foreground">
                      {formatDate(video.createdAt)}
                    </span>
                  </div>
                  {video.duration && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="text-foreground">
                        {formatDuration(video.duration)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Inspiration Mode
                    </span>
                    <span className="text-foreground">Off</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t border-border space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 font-medium text-xs rounded-lg"
                  onClick={handleDownload}
                >
                  <Download className="h-3 w-3" /> Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 font-medium text-xs rounded-lg"
                  onClick={handleShare}
                >
                  <Share2 className="h-3 w-3" /> Share
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex-1 font-medium text-xs rounded-lg ${
                    isFavorited ? "text-red-500 border-red-500" : ""
                  }`}
                  onClick={handleFavorite}
                >
                  <Heart
                    className="h-3 w-3"
                    fill={isFavorited ? "currentColor" : "none"}
                  />
                  {isFavorited ? "Favorited" : "Favorite"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 font-medium text-xs rounded-lg text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
