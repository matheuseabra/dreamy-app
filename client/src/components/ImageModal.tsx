import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Copy } from "lucide-react";
import { toast } from "sonner";

interface ImageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  image: {
    src: string;
    prompt: string;
    model: string;
  } | null;
}

export const ImageModal = ({ open, onOpenChange, image }: ImageModalProps) => {
  if (!image) return null;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(image.prompt);
    toast.success("Prompt copied to clipboard!");
  };

  const handleDownload = () => {
    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.href = image.src;
    link.download = `dreamforge-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image download started!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-card border-border">
        <div className="relative">
          <img
            src={image.src}
            alt={image.prompt}
            className="w-full h-auto max-h-[70vh] object-contain"
          />
        </div>
        <div className="p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Generated Image</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Model: {image.model}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Prompt</h4>
            <p className="text-sm text-foreground">{image.prompt}</p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleCopyPrompt}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Prompt
            </Button>
            <Button variant="gradient" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download Image
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
