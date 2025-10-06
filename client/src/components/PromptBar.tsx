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
import { Input } from "@/components/ui/input";
import {
  Brush,
  Crown,
  Gauge,
  ImageDown,
  Ratio,
  Rocket,
  Settings2,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { useMemo } from "react";

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
  square: "1:1",
  portrait_9_16: "9:16",
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

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 rounded-xl border border-border bg-background/70 px-3 py-2 shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground"
          disabled
        >
          <ImageDown className="h-4 w-4" />
        </Button>

        <Input
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Describe the scene you imagine, with details."
          className="border-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 text-sm flex-1"
        />

        {/* Model selector icon */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-muted-foreground"
            >
              <span className="text-xs">{selectedModelData.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-72 max-h-120 overflow-y-auto border border-border"
          >
            <DropdownMenuLabel>Models</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={selectedModel}
              onValueChange={onModelChange}
            >
              {AI_MODELS.map((m) => {
                return (
                  <DropdownMenuRadioItem
                    key={m.id}
                    value={m.id}
                    className="cursor-pointer h-16 flex items-center gap-3 px-3 py-2"
                  >
                    <div className="flex items-center justify-center w-6 h-6">
                      <m.icon className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col justify-center gap-0.5 flex-1 min-w-0">
                      <span className="text-sm font-medium truncate">
                        {m.name}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {m.description}
                      </span>
                    </div>
                  </DropdownMenuRadioItem>
                );
              })}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Aspect ratio selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-muted-foreground"
            >
              <Ratio className="h-4 w-4 mr-1" />
              <span className="text-xs">{SIZE_LABEL[size] || "1:1"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-40 border border-border"
          >
            <DropdownMenuLabel>Aspect Ratio</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={size} onValueChange={onSizeChange}>
              <DropdownMenuRadioItem value="square" className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    className="text-muted-foreground"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="10"
                      height="10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                  <span>1:1</span>
                </div>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="landscape_16_9"
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    className="text-muted-foreground"
                  >
                    <rect
                      x="2"
                      y="5"
                      width="12"
                      height="6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                  <span>16:9</span>
                </div>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="portrait_9_16"
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    className="text-muted-foreground"
                  >
                    <rect
                      x="5"
                      y="2"
                      width="6"
                      height="12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                  <span>9:16</span>
                </div>
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
            >
              <Settings2 className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 border border-border"
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
            <DropdownMenuRadioGroup value={style} onValueChange={onStyleChange}>
              <DropdownMenuRadioItem value="natural">
                Natural
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="vivid">Vivid</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="artistic">
                Artistic
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          onClick={onGenerate}
          disabled={isGenerating || !prompt.trim()}
          size="sm"
          className="h-8 px-4 rounded-xl bg-transparent hover:bg-transparent border border-border"
        >
          <span className="bg-gradient-to-r from-pink-300 via-blue-300 to-white bg-clip-text text-transparent font-sans text-sm">
            {isGenerating ? "Generating" : "Generate"}
          </span>
        </Button>
      </div>
    </div>
  );
}
