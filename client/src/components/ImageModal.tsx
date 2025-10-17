import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Copy, Download, Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useToggleFavorite } from "@/hooks/api/useGallery";

interface ImageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  image: {
    id?: string;
    src: string;
    prompt: string;
    model: string;
    createdAt?: string;
    aspectRatio?: string;
    isFavorited?: boolean;
  } | null;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export const ImageModal = ({
  open,
  onOpenChange,
  image,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
}: ImageModalProps) => {
  const [showFullPrompt, setShowFullPrompt] = useState(false);
  const toggleFavorite = useToggleFavorite();

  if (!image) return null;

  const MAX_PROMPT_LENGTH = 200;
  const isTruncated = image.prompt.length > MAX_PROMPT_LENGTH;
  const displayPrompt =
    !showFullPrompt && isTruncated
      ? image.prompt.slice(0, MAX_PROMPT_LENGTH) + "..."
      : image.prompt;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(image.prompt);
    toast.success("Prompt copied to clipboard!");
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(image.src, { mode: "cors" });
      if (!response.ok) throw new Error("Failed to download image");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `image-${Date.now()}.png`;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download image. Please try again.");
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "06 Oct 2025 08:03:41";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleFavorite = () => {
    if (!image.id) {
      toast.error("Cannot favorite this image");
      return;
    }
    toggleFavorite.mutate(image.id, {
      onSuccess: () => {
        toast.success(image.isFavorited ? "Removed from favorites" : "Added to favorites");
      },
      onError: () => {
        toast.error("Failed to update favorite status");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl w-[95vw] h-[90vh] p-0 overflow-hidden border-0">
        <div className="flex h-full">
          <div className="flex-1 relative flex items-center justify-center">
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

            <div
              aria-label={image.prompt}
              role="img"
              className="w-full h-full bg-center bg-contain bg-no-repeat"
              style={{ backgroundImage: `url(${image.src})` }}
            />
          </div>

          <div className="w-80 bg-card border-l border-border flex flex-col">
            <div className="p-4 border-b border-none">
              <div className="flex items-center justify-between gap-2">
                {image.id && (
                  <Button
                    variant="outline"
                    size="sm"
                    className={`font-medium text-xs rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0 ${
                      image.isFavorited ? 'text-red-500 border-red-500' : ''
                    }`}
                    onClick={handleFavorite}
                  >
                    <Heart className="h-3 w-3" fill={image.isFavorited ? "currentColor" : "none"} />
                    {image.isFavorited ? "Favorited" : "Favorite"}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="font-medium text-xs rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                  onClick={handleDownload}
                >
                  <Download className="h-3 w-3" /> Download
                </Button>
              </div>
            </div>
            <div className="flex-1 p-4 space-y-6 overflow-y-auto scrollbar-thin">
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
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-primary/20 text-primary border-primary/30"
                  >
                    {image.model}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-primary/20 text-primary border-primary/30"
                  >
                    {image.aspectRatio || "1:1"}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Creation Time</span>
                    <span className="text-foreground">
                      {formatDate(image.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Inspiration Mode
                    </span>
                    <span className="text-foreground">Off</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
