import { Button } from "@/components/ui/button";
import {
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { VIDEO_MODELS } from "@/config/videoModels";
import SettingsDropdown from "@/components/SettingsDropdown";
import ModelItem from "@/components/ModelItem";
import {
  ArrowUp,
  LoaderCircleIcon,
  Settings2,
  Video,
} from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

type VideoPromptBarProps = {
  prompt: string;
  onPromptChange: (value: string) => void;
  negativePrompt: string;
  onNegativePromptChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating?: boolean;
  selectedModel: string;
  onModelChange: (id: string) => void;
  aspectRatio: string;
  onAspectRatioChange: (value: string) => void;
  durationSeconds: number;
  onDurationSecondsChange: (value: number) => void;
  fps: number;
  onFpsChange: (value: number) => void;
  guidanceScale: number;
  onGuidanceScaleChange: (value: number) => void;
  enableSafetyChecker: boolean;
  onEnableSafetyCheckerChange: (value: boolean) => void;
  isOutOfCredits?: boolean;
};

const ASPECT_RATIOS = [
  { value: "16:9", label: "16:9 (Landscape)" },
  { value: "9:16", label: "9:16 (Portrait)" },
  { value: "1:1", label: "1:1 (Square)" },
  { value: "4:3", label: "4:3" },
  { value: "3:4", label: "3:4" },
];

const FPS_OPTIONS = [
  { value: 24, label: "24 FPS" },
  { value: 30, label: "30 FPS" },
  { value: 60, label: "60 FPS" },
];

export function VideoPromptBar({
  prompt,
  onPromptChange,
  negativePrompt,
  onNegativePromptChange,
  onGenerate,
  isGenerating,
  selectedModel,
  onModelChange,
  aspectRatio,
  onAspectRatioChange,
  durationSeconds,
  onDurationSecondsChange,
  fps,
  onFpsChange,
  guidanceScale,
  onGuidanceScaleChange,
  enableSafetyChecker,
  onEnableSafetyCheckerChange,
  isOutOfCredits = false,
}: VideoPromptBarProps) {
  const selectedModelData = useMemo(
    () => VIDEO_MODELS.find((m) => m.id === selectedModel) || VIDEO_MODELS[0],
    [selectedModel]
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";

      const scrollHeight = textarea.scrollHeight;
      const minHeight = 40;
      const maxHeight = 200;

      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
      textarea.style.height = `${newHeight}px`;
    }
  }, [prompt]);

  const estimatedCredits = useMemo(() => {
    return selectedModelData.creditsPerSecond * durationSeconds;
  }, [selectedModelData, durationSeconds]);

  return (
    <>
      <div className="bg-card/90 border border-border backdrop-blur-md gap-2 rounded-xl p-2 shadow-lg">
        <Textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Describe the video you want to create..."
          className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm flex-1 resize-none overflow-y-auto min-h-[40px] max-h-[200px]"
          rows={1}
        />

        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            {/* Model selector */}
            <SettingsDropdown
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 mt-1 flex-shrink-0 border border-border"
                >
                  <Video className="h-4 w-4 mr-1" />
                  <span className="text-xs">{selectedModelData.name}</span>
                </Button>
              }
              label="Video Models"
              className="w-100 max-h-[500px] overflow-y-auto border border-border"
            >
              <DropdownMenuRadioGroup
                value={selectedModel}
                onValueChange={onModelChange}
              >
                {VIDEO_MODELS.map((model) => (
                  <ModelItem
                    key={model.id}
                    model={model}
                    isSelected={model.id === selectedModel}
                    onSelect={() => onModelChange(model.id)}
                  />
                ))}
              </DropdownMenuRadioGroup>
            </SettingsDropdown>

            {/* Aspect ratio selector */}
            <SettingsDropdown
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 mt-1 flex-shrink-0 border border-border"
                >
                  <span className="text-xs">{aspectRatio}</span>
                </Button>
              }
              label="Aspect Ratio"
              className="w-48 border border-border"
            >
              <DropdownMenuRadioGroup
                value={aspectRatio}
                onValueChange={onAspectRatioChange}
              >
                {ASPECT_RATIOS.map((ratio) => (
                  <DropdownMenuRadioItem
                    key={ratio.value}
                    value={ratio.value}
                    className="cursor-pointer p-2"
                  >
                    <span>{ratio.label}</span>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </SettingsDropdown>

            {/* Duration selector */}
            <SettingsDropdown
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 mt-1 flex-shrink-0 border border-border"
                >
                  <span className="text-xs">{durationSeconds}s</span>
                </Button>
              }
              label="Duration"
              className="w-48 border border-border"
            >
              <div className="px-2 py-2">
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={durationSeconds}
                  onChange={(e) =>
                    onDurationSecondsChange(parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-muted/30 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1s</span>
                  <span>{durationSeconds}s</span>
                  <span>30s</span>
                </div>
                <div className="text-xs text-muted-foreground mt-2 text-center">
                  Est. {estimatedCredits} credits
                </div>
              </div>
            </SettingsDropdown>

            {/* Advanced settings */}
            <SettingsDropdown
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 mt-1 flex-shrink-0 border border-border"
                >
                  <Settings2 className="h-4 w-4" />
                </Button>
              }
              label="Advanced Settings"
            >
              <DropdownMenuLabel>FPS</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={fps.toString()}
                onValueChange={(val) => onFpsChange(parseInt(val))}
              >
                {FPS_OPTIONS.map((opt) => (
                  <DropdownMenuRadioItem
                    className="p-2"
                    key={opt.value}
                    value={opt.value.toString()}
                  >
                    {opt.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>

              <DropdownMenuSeparator />

              <DropdownMenuLabel>Guidance Scale</DropdownMenuLabel>
              <div className="px-2 py-2">
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.5"
                  value={guidanceScale}
                  onChange={(e) =>
                    onGuidanceScaleChange(parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-muted/30 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1</span>
                  <span>{guidanceScale}</span>
                  <span>20</span>
                </div>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuLabel>Negative Prompt</DropdownMenuLabel>
              <div className="px-2 py-2">
                <Textarea
                  value={negativePrompt}
                  onChange={(e) => onNegativePromptChange(e.target.value)}
                  placeholder="What to avoid in the video..."
                  className="text-xs min-h-[60px]"
                />
              </div>

              <DropdownMenuSeparator />

              <div className="flex items-center justify-between px-2 py-2">
                <DropdownMenuLabel className="p-0">
                  Safety Checker
                </DropdownMenuLabel>
                <input
                  type="checkbox"
                  checked={enableSafetyChecker}
                  onChange={(e) =>
                    onEnableSafetyCheckerChange(e.target.checked)
                  }
                  className="h-4 w-4"
                />
              </div>
            </SettingsDropdown>
          </div>

          <div className="flex items-center">
            <Button
              variant="outline"
              onClick={onGenerate}
              disabled={isGenerating || isOutOfCredits || !prompt.trim()}
              size="sm"
              className="h-10 rounded-xl mt-1 flex-shrink-0"
            >
              {isGenerating ? (
                <LoaderCircleIcon className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUp className="h-8 w-8" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
