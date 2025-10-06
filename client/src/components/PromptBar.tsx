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
    Camera,
    Crown,
    Gauge,
    ImageDown,
    Layers,
    Palette,
    Ratio,
    Rocket,
    Settings2,
    Sparkles,
    Star,
    Wand2,
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
    id: "fal-ai/flux/dev/image-to-image",
    name: "Flux Dev I2I",
    description: "Image-to-image with Flux Dev",
    icon: Wand2,
  },
  {
    id: "fal-ai/flux-1/schnell/redux",
    name: "Flux Schnell Redux",
    description: "Enhanced Flux Schnell model",
    icon: Wand2,
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
    id: "fal-ai/flux-kontext/dev",
    name: "Flux Kontext Dev",
    description: "Development context model",
    icon: Layers,
  },
  {
    id: "fal-ai/flux-kontext-lora",
    name: "Flux Kontext LoRA",
    description: "LoRA-enhanced context model",
    icon: Palette,
  },
  {
    id: "fal-ai/recraft/v3/text-to-image",
    name: "Recraft V3 T2I",
    description: "Advanced text-to-image generation",
    icon: Brush,
  },
  {
    id: "fal-ai/recraft/v3/image-to-image",
    name: "Recraft V3 I2I",
    description: "Advanced image-to-image generation",
    icon: Camera,
  },
  {
    id: "fal-ai/ideogram/v2",
    name: "Ideogram V2",
    description: "Text rendering and design generation",
    icon: Rocket,
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
  portrait: "2:3",
  landscape: "3:2",
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
  const SelectedIcon = selectedModelData.icon;

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
          <DropdownMenuContent align="end" className="w-100 border-none">
            <DropdownMenuRadioGroup
              value={selectedModel}
              onValueChange={onModelChange}
            >
              {AI_MODELS.map((m) => {
                return (
                  <DropdownMenuRadioItem
                    key={m.id}
                    value={m.id}
                    className="cursor-pointer flex flex-col items-start gap-0.5"
                  >
                    <div className="flex items-center gap-1">
                      <m.icon className="h-4 w-4 mr-1" />
                      <div className="flex flex-col items-start gap-0.5">
                        <span className="text-sm font-medium">{m.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {m.description}
                        </span>
                      </div>
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
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>Aspect ratio</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={size} onValueChange={onSizeChange}>
              <DropdownMenuRadioItem value="square">
                1:1 (1024×1024)
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="portrait">
                2:3 (1024×1536)
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="landscape">
                3:2 (1536×1024)
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Quality and style collapsed under settings */}
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
          <DropdownMenuContent align="end" className="w-56">
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

        {/* Generate button */}
        <Button
          variant="gradient"
          size="sm"
          className="h-8 px-3 font-semibold"
          onClick={onGenerate}
          disabled={isGenerating || !prompt.trim()}
        >
          <Sparkles className="h-4 w-4 mr-1" />{" "}
          {isGenerating ? "Generating" : "Generate"}
        </Button>
      </div>
    </div>
  );
}
