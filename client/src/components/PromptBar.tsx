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
import { config } from "@/config";
import useAuth from "@/hooks/useAuth";
import {
  Brush,
  Crown,
  Gauge,
  Image,
  ImageDown,
  LoaderCircleIcon,
  Palette,
  Ratio,
  Rocket,
  SendHorizonalIcon,
  Settings2,
  Sparkles,
  Star,
  User,
  X,
  Zap
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
    case "landscape_4_3":
      return (
        <svg {...iconProps}>
          <rect x="2" y="4" width="12" height="8" {...rectProps} />
        </svg>
      );
    case "portrait_4_3":
      return (
        <svg {...iconProps}>
          <rect x="4" y="2" width="8" height="12" {...rectProps} />
        </svg>
      );
    case "square_hd":
      return (
        <svg {...iconProps}>
          <rect x="2" y="2" width="12" height="12" {...rectProps} />
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
  sourceImageUrl?: string;
  onSourceImageChange?: (url: string | null) => void;
  strength?: number;
  onStrengthChange?: (value: number) => void;
};

const AI_MODELS = [
  {
    id: "fal-ai/flux/dev",
    name: "Flux Dev",
    description: "High quality text-to-image generation",
    icon: Sparkles,
    type: "text-to-image",
  },
  {
    id: "fal-ai/flux/schnell",
    name: "Flux Schnell",
    description: "Fast text-to-image generation",
    icon: Zap,
    type: "text-to-image",
  },
  {
    id: "fal-ai/flux-pro/kontext",
    name: "Flux Pro Kontext",
    description: "Professional context-aware generation",
    icon: Crown,
    type: "text-to-image",
  },
  {
    id: "fal-ai/flux-pro/kontext/max",
    name: "Flux Pro Kontext Max",
    description: "Maximum quality context generation",
    icon: Star,
    type: "text-to-image",
  },
  {
    id: "fal-ai/recraft/v3/text-to-image",
    name: "Recraft V3",
    description: "Advanced text-to-image generation",
    icon: Brush,
    type: "text-to-image",
  },
  {
    id: "fal-ai/ideogram/v3",
    name: "Ideogram V3",
    description: "Latest text rendering capabilities",
    icon: Rocket,
    type: "text-to-image",
  },
  {
    id: "fal-ai/nano-banana",
    name: "Nano Banana",
    description: "Lightweight fast generation",
    icon: Zap,
    type: "text-to-image",
  },
  {
    id: "fal-ai/wan/v2.2-5b/text-to-image",
    name: "WAN V2.2",
    description: "5B parameter text-to-image model",
    icon: Gauge,
    type: "text-to-image",
  },
  // Image-to-Image Models
  {
    id: "fal-ai/flux/dev/image-to-image",
    name: "Flux Dev I2I",
    description: "FLUX.1 [dev] image-to-image endpoint",
    icon: Image,
    type: "image-to-image",
  },
  {
    id: "fal-ai/flux-general/image-to-image",
    name: "Flux General I2I",
    description: "FLUX.1 [dev] with ControlNets / LoRAs",
    icon: Palette,
    type: "image-to-image",
  },
  {
    id: "fal-ai/flux-lora/image-to-image",
    name: "Flux LoRA I2I",
    description: "FLUX.1 [dev] + LoRA adaptation I2I",
    icon: Sparkles,
    type: "image-to-image",
  },
  {
    id: "fal-ai/ideogram/character",
    name: "Ideogram Character",
    description: "Ideogram V3 Character I2I (consistent characters)",
    icon: User,
    type: "image-to-image",
  },
  {
    id: "fal-ai/recraft/v3/image-to-image",
    name: "Recraft V3 I2I",
    description: "Recraft V3 image-to-image endpoint",
    icon: Brush,
    type: "image-to-image",
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
  sourceImageUrl,
  onSourceImageChange,
  strength = 0.8,
  onStrengthChange,
}: PromptBarProps) {
  const authToken = useAuth().session?.access_token;
  const selectedModelData = useMemo(
    () => AI_MODELS.find((m) => m.id === selectedModel) || AI_MODELS[0],
    [selectedModel]
  );

  const isImageToImage = selectedModelData?.type === "image-to-image";
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

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

  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!file) return;

      // Validate file type
      const allowedTypes = [
        "image/png",
        "image/jpg",
        "image/jpeg",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert(
          "Invalid file type. Please upload PNG, JPG, JPEG, or WEBP files."
        );
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size too large. Please upload files smaller than 10MB.");
        return;
      }

      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch(`${config.API_URL}/api/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const result = await response.json();
        if (result.success && onSourceImageChange) {
          onSourceImageChange(result.data.url);
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("Failed to upload image. Please try again.");
      } finally {
        setIsUploading(false);
      }
    },
    [onSourceImageChange]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileUpload(e.dataTransfer.files[0]);
      }
    },
    [handleFileUpload]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        handleFileUpload(e.target.files[0]);
      }
    },
    [handleFileUpload]
  );

  const handleRemoveImage = useCallback(() => {
    if (onSourceImageChange) {
      onSourceImageChange(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [onSourceImageChange]);

  return (
    <>
      <div className="bg-background/90 backdrop-blur-md gap-2 rounded-xl border border-border px-3 py-2 shadow-lg">
        {isImageToImage && sourceImageUrl && (
          <div className="relative">
            <div className="relative inline-block">
              <img
                src={sourceImageUrl}
                alt="Source"
                className="h-12 w-12 object-cover rounded-lg border border-border"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-1 -right-1 h-6 w-6 bg-background border border-border shadow-sm"
                onClick={handleRemoveImage}
              >
                <X className="h-1 w-1" />
              </Button>
            </div>
          </div>
        )}
        <Textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder={
            isImageToImage
              ? "Describe how you want to transform the image..."
              : "Describe the scene you imagine, with details."
          }
          className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm flex-1 resize-none overflow-y-auto min-h-[40px] max-h-[200px]"
          rows={1}
        />

        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            {isImageToImage ? (
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpg,image/jpeg,image/webp"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 border border-border text-muted-foreground bg-muted/50 hover:bg-muted/70 mt-1 flex-shrink-0"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {isUploading ? (
                    <LoaderCircleIcon className="h-4 w-4 animate-spin" />
                  ) : (
                    <ImageDown className="h-4 w-4" />
                  )}
                </Button>
                {dragActive && (
                  <div className="absolute inset-0 bg-primary/20 rounded border-2 border-dashed border-primary pointer-events-none" />
                )}
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 border border-border text-muted-foreground bg-muted/50 hover:bg-muted/70 mt-1 flex-shrink-0"
                disabled
              >
                <ImageDown className="h-4 w-4" />
              </Button>
            )}

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
              className="w-100 max-h-[400px] overflow-y-auto border border-border"
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
              {isImageToImage && onStrengthChange && (
                <>
                  <DropdownMenuLabel>Strength</DropdownMenuLabel>
                  <div className="px-2 py-2">
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.1"
                      value={strength}
                      onChange={(e) =>
                        onStrengthChange(parseFloat(e.target.value))
                      }
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>0.1</span>
                      <span>{strength}</span>
                      <span>1.0</span>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                </>
              )}
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
    </>
  );
}
