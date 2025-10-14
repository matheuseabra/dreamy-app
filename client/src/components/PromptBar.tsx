import AspectRatioIcon from "@/components/AspectRatioIcon";
import ModelItem from "@/components/ModelItem";
import SettingsDropdown from "@/components/SettingsDropdown";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { config } from "@/config";
import {
  IMAGE_TO_IMAGE_MODELS,
  SIZE_LABEL,
  TEXT_TO_IMAGE_MODELS,
} from "@/config/imageModels";
import useAuth from "@/hooks/useAuth";
import {
  ImageDown,
  LoaderCircleIcon,
  Ratio,
  SendHorizonalIcon,
  Settings2,
  X
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
    () => {
      const allModels = [...TEXT_TO_IMAGE_MODELS, ...IMAGE_TO_IMAGE_MODELS];
      return allModels.find((m) => m.id === selectedModel) || TEXT_TO_IMAGE_MODELS[0];
    },
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
      [onSourceImageChange, authToken]
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
      <div className="bg-card/90 border border-border backdrop-blur-md gap-2 rounded-xl p-2 shadow-lg">
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
                className="absolute -top-1 -right-1 h-6 w-6 border border-border shadow-sm"
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
                  className="h-8 w-8 mt-1 flex-shrink-0 border border-border"
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
                className="h-8 w-8 mt-1 flex-shrink-0 border border-border"
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
                  className="h-8 px-2 mt-1 flex-shrink-0 border border-border"
                >
                  <span className="text-xs">{selectedModelData.name}</span>
                </Button>
              }
              label="Text-to-Image Models"
              className="w-100 max-h-[500px] overflow-y-auto border border-border"
            >
              <DropdownMenuRadioGroup
                value={selectedModel}
                onValueChange={onModelChange}
              >
                {TEXT_TO_IMAGE_MODELS.map((model) => (
                  <ModelItem
                    key={model.id}
                    model={model}
                    isSelected={model.id === selectedModel}
                    onSelect={() => onModelChange(model.id)}
                  />
                ))}
                <DropdownMenuLabel>Image-to-Image Models</DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1" />
                {IMAGE_TO_IMAGE_MODELS.map((model) => (
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
                    className="cursor-pointer p-2"
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
                  className="h-8 w-8 mt-1 flex-shrink-0 border border-border"
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
                      className="w-full h-2 bg-muted/30 rounded-lg appearance-none cursor-pointer"
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
                {[
                  { value: "standard", label: "Standard" },
                  { value: "hd", label: "HD" },
                  { value: "ultra", label: "Ultra HD" },
                ].map((opt) => (
                  <DropdownMenuRadioItem
                    className="p-2"
                    key={opt.value}
                    value={opt.value}
                  >
                    {opt.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>

              <DropdownMenuSeparator />

              <DropdownMenuLabel>Style</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={style}
                onValueChange={onStyleChange}
              >
                {[
                  { value: "natural", label: "Natural" },
                  { value: "vivid", label: "Vivid" },
                  { value: "artistic", label: "Artistic" },
                ].map((opt) => (
                  <DropdownMenuRadioItem
                    className="p-2"
                    key={opt.value}
                    value={opt.value}
                  >
                    {opt.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </SettingsDropdown>
          </div>
          <div className="flex items-center">
            <Button
              variant="outline"
              onClick={onGenerate}
              disabled={isGenerating || !prompt.trim()}
              size="sm"
              className="h-8 px-4 rounded-lg mt-1 flex-shrink-0"
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
