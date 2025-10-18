import { VideoGallery } from "@/components/VideoGallery";
import { VideoModal } from "@/components/VideoModal";
import { VideoPromptBar } from "@/components/VideoPromptBar";
import PricingDialog from "@/components/pricing/PricingDialog";
import { useVideoGeneration } from "@/hooks/useVideoGeneration";
import { useVideos } from "@/hooks/api";
import { useEffect, useMemo, useState } from "react";

interface GeneratedVideo {
  id: string;
  src: string;
  prompt: string;
  model: string;
  duration?: number;
  thumbnailUrl?: string;
  aspectRatio?: string;
}

const Video = () => {
  const {
    prompt,
    setPrompt,
    negativePrompt,
    setNegativePrompt,
    selectedModel,
    setSelectedModel,
    aspectRatio,
    setAspectRatio,
    durationSeconds,
    setDurationSeconds,
    fps,
    setFps,
    guidanceScale,
    setGuidanceScale,
    enableSafetyChecker,
    setEnableSafetyChecker,
    isGenerating,
    handleGenerate,
    generatedVideosLocal,
    setGeneratedVideosLocal,
    cleanup,
    // pricing dialog controls exposed by the hook
    showPricingDialog,
    setShowPricingDialog,
    requiredCredits,
  } = useVideoGeneration();

  const [selectedVideo, setSelectedVideo] = useState<GeneratedVideo | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Use the video list hook
  const { data: videoList, isLoading: videosLoading } = useVideos({ limit: 50 });

  // Transform videos to match GeneratedVideo interface
  const transformedVideos: GeneratedVideo[] = useMemo(
    () =>
      videoList?.videos
        ? videoList.videos.map((vid) => ({
            id: vid.id,
            src: vid.url || "",
            prompt: vid.prompt || "No prompt available",
            model: vid.model || "Unknown",
            duration: vid.duration_seconds,
            thumbnailUrl: vid.thumbnailUrl || undefined,
            aspectRatio: vid.aspectRatio || undefined,
          }))
        : [],
    [videoList]
  );

  // Always sync local list with transformedVideos (even if empty)
  // This ensures the gallery shows the empty state when the server returns
  // an empty list instead of keeping previous state.
  useEffect(() => {
    setGeneratedVideosLocal(transformedVideos);
  }, [transformedVideos, setGeneratedVideosLocal]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  const handleVideoClick = (video: GeneratedVideo) => {
    setSelectedVideo(video);
    setModalOpen(true);
  };

  return (
    <div className="relative min-h-screen">
      <div className="container mx-auto">
        <VideoGallery
          onVideoClick={handleVideoClick}
          generatedVideos={
            generatedVideosLocal.length > 0 ? generatedVideosLocal : transformedVideos
          }
          isLoading={videosLoading}
          isGenerating={isGenerating}
          currentPrompt={prompt}
        />
      </div>

      <div className="fixed w-full max-w-3xl z-99 bottom-2 mx-auto right-0 left-[240px]">
        <VideoPromptBar
          prompt={prompt}
          onPromptChange={setPrompt}
          negativePrompt={negativePrompt}
          onNegativePromptChange={setNegativePrompt}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          aspectRatio={aspectRatio}
          onAspectRatioChange={setAspectRatio}
          durationSeconds={durationSeconds}
          onDurationSecondsChange={setDurationSeconds}
          fps={fps}
          onFpsChange={setFps}
          guidanceScale={guidanceScale}
          onGuidanceScaleChange={setGuidanceScale}
          enableSafetyChecker={enableSafetyChecker}
          onEnableSafetyCheckerChange={setEnableSafetyChecker}
        />
      </div>

      <VideoModal open={modalOpen} onOpenChange={setModalOpen} video={selectedVideo} />

      <PricingDialog
        open={showPricingDialog}
        onOpenChange={setShowPricingDialog}
        requiredCredits={requiredCredits}
        title="Insufficient credits"
        description="Add credits to continue generating videos."
      />
    </div>
  );
};

export default Video;
