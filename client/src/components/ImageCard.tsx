import { Card } from "@/components/ui/card";
import { Download, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageCardProps {
  src: string;
  prompt: string;
  model: string;
  onClick: () => void;
}

export const ImageCard = ({ src, prompt, model, onClick }: ImageCardProps) => {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = src;
    link.download = `dreamforge-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="group relative overflow-hidden bg-card border-border cursor-pointer transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20">
      <div className="aspect-square relative" onClick={onClick}>
        <img
          src={src}
          alt={prompt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            <p className="text-sm font-medium text-foreground line-clamp-2">{prompt}</p>
            <p className="text-xs text-muted-foreground">{model}</p>
          </div>
        </div>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
          <Button
            size="icon"
            variant="secondary"
            onClick={handleDownload}
            className="h-8 w-8"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
