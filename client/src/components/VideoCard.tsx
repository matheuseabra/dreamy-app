import { useRef, useState } from "react";

interface VideoCardProps {
  src: string;
  thumbnailUrl?: string;
  prompt: string;
  model: string;
  duration?: number;
  onClick: () => void;
}

export const VideoCard = ({
  src,
  thumbnailUrl,
  prompt,
  model,
  duration,
  onClick,
}: VideoCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Handle autoplay restrictions silently
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className="group relative aspect-video overflow-hidden rounded-lg cursor-pointer"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Thumbnail or video preview */}
      <div className="absolute inset-0 bg-muted/20">
        {thumbnailUrl && !isHovering ? (
          <img
            src={thumbnailUrl}
            alt={prompt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <video
            ref={videoRef}
            src={src}
            className="w-full h-full object-cover"
            muted
            playsInline
            preload="metadata"
            loop
          />
        )}
      </div>

      {/* Duration badge */}
      {duration !== undefined && (
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {formatDuration(duration)}
        </div>
      )}

      {/* Info overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-white text-sm line-clamp-2 mb-1">{prompt}</p>
        <p className="text-white/70 text-xs">{model}</p>
      </div>
    </div>
  );
};
