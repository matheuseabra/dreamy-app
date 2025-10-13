import { ImageGrid } from "@/components/ImageGrid";
import { ImageModal } from "@/components/ImageModal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { fetchPublicImages } from "@/lib/api";
import { QUERY_KEYS, createQueryOptions } from "@/lib/query-config";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useState } from "react";

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

interface PublicImagesResponse {
  success: boolean;
  objects: PublicImage[];
  total: number;
}

export default function Explore() {
  const [selectedImage, setSelectedImage] = useState<PublicImage | null>(null);

  const {
    data: imagesData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery<PublicImagesResponse>({
    queryKey: QUERY_KEYS.publicImages,
    queryFn: fetchPublicImages,
    ...createQueryOptions(),
  });

  const handleImageClick = (image: PublicImage) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold text-foreground">Explore</h1>
            <Alert className="max-w-md mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load images. Please try again.
              </AlertDescription>
            </Alert>
            <Button onClick={() => refetch()} disabled={isRefetching}>
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isRefetching ? "animate-spin" : ""}`}
              />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="container mx-auto">
        <div className="my-12 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
            Unleash Your Imagination
          </h1>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="space-y-1">
                <div className="aspect-square bg-muted/20 rounded-lg animate-pulse" />
              </div>
            ))}
          </div>
        ) : imagesData && imagesData.objects.length > 0 ? (
          <ImageGrid
            images={imagesData.objects}
            onImageClick={handleImageClick}
          />
        ) : (
          <div className="text-center space-y-4">
            <Alert className="max-w-md mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No public images found. Be the first to share your creations!
              </AlertDescription>
            </Alert>
          </div>
        )}

        {selectedImage && (
          <ImageModal
            open={!!selectedImage}
            onOpenChange={(open) => !open && handleCloseModal()}
            image={{
              src: selectedImage.publicUrl,
              prompt: selectedImage.name,
              model: "AI Generated",
              createdAt: selectedImage.created_at,
              aspectRatio: "1:1",
            }}
          />
        )}
      </div>
    </div>
  );
}
