import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Eye, Heart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface PublicImage {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: {
    eTag: string;
    size: number;
    mimetype: string;
    cacheControl: string;
    lastModified: string;
    contentLength: number;
    httpStatusCode: number;
  };
  publicUrl: string;
}

interface ImageGridProps {
  images: PublicImage[];
  onImageClick: (image: PublicImage) => void;
}

export const ImageGrid = ({ images, onImageClick }: ImageGridProps) => {
  const [columns, setColumns] = useState<PublicImage[][]>([[], [], [], []]);
  const gridRef = useRef<HTMLDivElement>(null);

  // Generate random heights for variety in the grid
  const getRandomHeight = () => {
    const heights = ['h-64', 'h-80', 'h-96', 'h-72', 'h-60'];
    return heights[Math.floor(Math.random() * heights.length)];
  };

  // Distribute images across columns for masonry effect
  useEffect(() => {
    const numColumns = 4;
    const newColumns: PublicImage[][] = Array(numColumns).fill(null).map(() => []);
    
    images.forEach((image, index) => {
      const columnIndex = index % numColumns;
      newColumns[columnIndex].push(image);
    });
    
    setColumns(newColumns);
  }, [images]);

  const handleDownload = (e: React.MouseEvent, image: PublicImage) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = image.publicUrl;
    link.download = `dreamy-studio-${image.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1">
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="space-y-1">
          {column.map((image, imageIndex) => (
            <Card
              key={`${columnIndex}-${imageIndex}`}
              className="group relative overflow-hidden bg-card border-border cursor-pointer transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20"
              onClick={() => onImageClick(image)}
            >
              <div className={`relative ${getRandomHeight()}`}>
                <img
                  src={image.publicUrl}
                  alt={image.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                
                {/* Overlay with image info */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {formatDate(image.created_at)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {Math.floor(Math.random() * 100) + 1}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(image.metadata.size)}
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={(e) => handleDownload(e, image)}
                    className="h-8 w-8 bg-background/80 hover:bg-background"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
};
