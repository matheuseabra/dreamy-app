import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Star,
  ThumbsDown,
  ThumbsUp
} from "lucide-react";
import { toast } from "sonner";

interface ImageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  image: {
    src: string;
    prompt: string;
    model: string;
    createdAt?: string;
    aspectRatio?: string;
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
  if (!image) return null;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(image.prompt);
    toast.success("Prompt copied to clipboard!");
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = image.src;
    link.download = `dreamforge-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image download started!");
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

            <img
              src={image.src}
              alt={image.prompt}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div className="w-80 bg-card border-l border-border flex flex-col">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <br />
                </div>
              </div>
            </div>
            <div className="flex-1 p-4 space-y-6 overflow-y-auto scrollbar-thin">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {image.prompt}
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

            {/* Footer */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Star className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
