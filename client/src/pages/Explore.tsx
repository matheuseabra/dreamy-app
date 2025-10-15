import { ImageGrid } from "@/components/ImageGrid";
import { ImageModal } from "@/components/ImageModal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublicImages } from "@/hooks/api";
import { AlertCircle, RefreshCw, ImageOff } from "lucide-react";
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

interface SelectedImageData {
  src: string;
  prompt: string;
  model: string;
  createdAt: string;
  aspectRatio: string;
}

export default function Explore() {
  const [selectedImage, setSelectedImage] = useState<PublicImage | null>(null);

  const {
    data: imagesData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = usePublicImages();

  const handleImageClick = (image: PublicImage) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  // Transform selected image for modal
  const modalImageData: SelectedImageData | null = selectedImage
    ? {
        src: selectedImage.publicUrl,
        prompt: selectedImage.name,
        model: "AI Generated",
        createdAt: selectedImage.created_at,
        aspectRatio: "1:1",
      }
    : null;

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold text-foreground">Explore</h1>
            <Alert variant="destructive" className="max-w-md mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error.message || "Failed to load images. Please try again."}
              </AlertDescription>
            </Alert>
            <Button onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
              />
              {isFetching ? "Retrying..." : "Try Again"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4">
          <div className="my-12 text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
              Unleash Your Imagination
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <Skeleton key={index} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  const hasImages = imagesData?.objects && imagesData.objects.length > 0;

  if (!hasImages) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4">
          <div className="my-12 text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
              Unleash Your Imagination
            </h1>
          </div>
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <ImageOff className="h-16 w-16 text-muted-foreground" />
            <Alert className="max-w-md mx-auto">
              <AlertDescription className="text-center">
                No public images found yet. Be the first to share your
                creations!
              </AlertDescription>
            </Alert>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main content with images
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <div className="my-12 text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
            Unleash Your Imagination
          </h1>
        </div>

        {/* Background fetching indicator */}
        {isFetching && !isLoading && (
          <div className="fixed top-4 right-4 z-50">
            <Alert className="w-auto">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <AlertDescription>Refreshing images...</AlertDescription>
            </Alert>
          </div>
        )}

        <ImageGrid
          images={imagesData.objects}
          onImageClick={handleImageClick}
        />
      </div>

      {/* Image Modal */}
      {modalImageData && (
        <ImageModal
          open={!!selectedImage}
          onOpenChange={(open) => !open && handleCloseModal()}
          image={modalImageData}
        />
      )}
    </div>
  );
}
