import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import {
  Brush,
  Crown,
  Gauge,
  ImageDown,
  LoaderCircleIcon,
  Ratio,
  Rocket,
  SendHorizonalIcon,
  Settings2,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

const AspectRatioIcon = ({ ratio }: { ratio: string }) => {
  const iconProps = {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    className: "text-muted-foreground",
  };

  const rectProps = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
  };

  switch (ratio) {
    case "square":
      return (
        <svg {...iconProps}>
          <rect x="3" y="3" width="10" height="10" {...rectProps} />
        </svg>
      );
    case "landscape_16_9":
      return (
        <svg {...iconProps}>
          <rect x="2" y="5" width="12" height="6" {...rectProps} />
        </svg>
      );
    case "portrait_9_16":
      return (
        <svg {...iconProps}>
          <rect x="5" y="2" width="6" height="12" {...rectProps} />
        </svg>
      );
    default:
      return null;
  }
};

const SettingsDropdown = ({
  trigger,
  label,
  children,
  className = "w-56 border border-border",
}: {
  trigger: React.ReactNode;
  label: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
    <DropdownMenuContent align="start" className={className}>
      <DropdownMenuLabel>{label}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {children}
    </DropdownMenuContent>
  </DropdownMenu>
);

const ModelItem = ({
  model,
  isSelected,
  onSelect,
}: {
  model: (typeof AI_MODELS)[0];
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const Icon = model.icon;
  return (
    <DropdownMenuRadioItem
      value={model.id}
      className="cursor-pointer h-16 flex items-center gap-3 px-3 py-2"
    >
      <div className="flex items-center justify-center w-6 h-6">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex flex-col justify-center gap-0.5 flex-1 min-w-0">
        <span className="text-sm font-medium truncate">{model.name}</span>
        <span className="text-xs text-muted-foreground truncate">
          {model.description}
        </span>
      </div>
    </DropdownMenuRadioItem>
  );
};

type PromptBarProps = {
  prompt: string;
  onPromptChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating?: boolean;
  selectedModel: string;
  onModelChange: (id: string) => void;
  size: string;
  onSizeChange: (value: string) => void;
  quality: string;
  onQualityChange: (value: string) => void;
  style: string;
  onStyleChange: (value: string) => void;
};

const AI_MODELS = [
  {
    id: "fal-ai/flux/dev",
    name: "Flux Dev",
    description: "High quality text-to-image generation",
    icon: Sparkles,
  },
  {
    id: "fal-ai/flux/schnell",
    name: "Flux Schnell",
    description: "Fast text-to-image generation",
    icon: Zap,
  },
  {
    id: "fal-ai/flux-pro/kontext",
    name: "Flux Pro Kontext",
    description: "Professional context-aware generation",
    icon: Crown,
  },
  {
    id: "fal-ai/flux-pro/kontext/max",
    name: "Flux Pro Kontext Max",
    description: "Maximum quality context generation",
    icon: Star,
  },
  {
    id: "fal-ai/recraft/v3/text-to-image",
    name: "Recraft V3",
    description: "Advanced text-to-image generation",
    icon: Brush,
  },
  {
    id: "fal-ai/ideogram/v3",
    name: "Ideogram V3",
    description: "Latest text rendering capabilities",
    icon: Rocket,
  },
  {
    id: "fal-ai/nano-banana",
    name: "Nano Banana",
    description: "Lightweight fast generation",
    icon: Zap,
  },
  {
    id: "fal-ai/wan/v2.2-5b/text-to-image",
    name: "WAN V2.2",
    description: "5B parameter text-to-image model",
    icon: Gauge,
  },
];

const SIZE_LABEL: Record<string, string> = {
  square_hd: "1:1 HD",
  square: "1:1",
  portrait_4_3: "3:4",
  portrait_16_9: "9:16",
  landscape_4_3: "4:3",
  landscape_16_9: "16:9",
};

export function PromptBar({
  prompt,
  onPromptChange,
  onGenerate,
  isGenerating,
  selectedModel,
  onModelChange,
  size,
  onSizeChange,
  quality,
  onQualityChange,
  style,
  onStyleChange,
}: PromptBarProps) {
  const selectedModelData = useMemo(
    () => AI_MODELS.find((m) => m.id === selectedModel) || AI_MODELS[0],
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

  return (
    <div className="w-full max-w-3xl mx-auto shadow-lg">
      <div className="bg-background/90 backdrop-blur-md gap-2 rounded-xl border border-border px-3 py-2 shadow-sm">
        <Textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Describe the scene you imagine, with details."
          className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm flex-1 resize-none overflow-y-auto min-h-[40px] max-h-[200px]"
          rows={1}
        />

        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 border border-border text-muted-foreground bg-muted/50 hover:bg-muted/70 mt-1 flex-shrink-0"
              disabled
            >
              <ImageDown className="h-4 w-4" />
            </Button>

            <SettingsDropdown
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 border border-border text-muted-foreground bg-muted/50 hover:bg-muted/70 mt-1 flex-shrink-0"
                >
                  <span className="text-xs">{selectedModelData.name}</span>
                </Button>
              }
              label="Models"
              className="w-72 max-h-120 overflow-y-auto border border-border"
            >
              <DropdownMenuRadioGroup
                value={selectedModel}
                onValueChange={onModelChange}
              >
                {AI_MODELS.map((model) => (
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
                  className="h-8 px-2 border border-border text-muted-foreground bg-muted/50 hover:bg-muted/70 mt-1 flex-shrink-0"
                >
                  <Ratio className="h-4 w-4 mr-1" />
                  <span className="text-xs">{SIZE_LABEL[size] || "1:1"}</span>
                </Button>
              }
              label="Aspect Ratio"
              className="w-40 border border-border"
            >
              <DropdownMenuRadioGroup value={size} onValueChange={onSizeChange}>
                {Object.entries(SIZE_LABEL).map(([value, label]) => (
                  <DropdownMenuRadioItem
                    key={value}
                    value={value}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <AspectRatioIcon ratio={value} />
                      <span>{label}</span>
                    </div>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </SettingsDropdown>

            <SettingsDropdown
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 border border-border text-muted-foreground bg-muted/50 hover:bg-muted/70 mt-1 flex-shrink-0"
                >
                  <Settings2 className="h-4 w-4" />
                </Button>
              }
              label="Settings"
            >
              <DropdownMenuLabel>Quality</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={quality}
                onValueChange={onQualityChange}
              >
                <DropdownMenuRadioItem value="standard">
                  Standard
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="hd">HD</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="ultra">
                  Ultra HD
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Style</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={style}
                onValueChange={onStyleChange}
              >
                <DropdownMenuRadioItem value="natural">
                  Natural
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="vivid">
                  Vivid
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="artistic">
                  Artistic
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </SettingsDropdown>
          </div>
          <div className="flex items-center">
            <Button
              onClick={onGenerate}
              disabled={isGenerating || !prompt.trim()}
              size="sm"
              className="h-8 px-4 rounded-lg bg-muted/50 hover:bg-muted/70 border border-border mt-1 flex-shrink-0"
            >
              {isGenerating ? (
                <LoaderCircleIcon className="h-4 w-4 animate-spin" />
              ) : (
                <SendHorizonalIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
