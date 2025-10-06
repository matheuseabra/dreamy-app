import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brush, Camera, Crown, Gauge, Image, Layers, Palette, Rocket, Sparkles, Star, Wand2, Zap } from "lucide-react";

const AI_MODELS = [
  { id: "fal-ai/flux/dev", name: "Flux Dev", description: "High quality text-to-image generation", icon: Sparkles },
  { id: "fal-ai/flux/schnell", name: "Flux Schnell", description: "Fast text-to-image generation", icon: Zap },
  { id: "fal-ai/flux/dev/image-to-image", name: "Flux Dev I2I", description: "Image-to-image with Flux Dev", icon: Image },
  { id: "fal-ai/flux-1/schnell/redux", name: "Flux Schnell Redux", description: "Enhanced Flux Schnell model", icon: Wand2 },
  { id: "fal-ai/flux-pro/kontext", name: "Flux Pro Kontext", description: "Professional context-aware generation", icon: Crown },
  { id: "fal-ai/flux-pro/kontext/max", name: "Flux Pro Kontext Max", description: "Maximum quality context generation", icon: Star },
  { id: "fal-ai/flux-kontext/dev", name: "Flux Kontext Dev", description: "Development context model", icon: Layers },
  { id: "fal-ai/flux-kontext-lora", name: "Flux Kontext LoRA", description: "LoRA-enhanced context model", icon: Palette },
  { id: "fal-ai/recraft/v3/text-to-image", name: "Recraft V3 T2I", description: "Advanced text-to-image generation", icon: Brush },
  { id: "fal-ai/recraft/v3/image-to-image", name: "Recraft V3 I2I", description: "Advanced image-to-image generation", icon: Camera },
  { id: "fal-ai/ideogram/v2", name: "Ideogram V2", description: "Text rendering and design generation", icon: Rocket },
  { id: "fal-ai/ideogram/v3", name: "Ideogram V3", description: "Latest text rendering capabilities", icon: Rocket },
  { id: "fal-ai/nano-banana", name: "Nano Banana", description: "Lightweight fast generation", icon: Zap },
  { id: "fal-ai/wan/v2.2-5b/text-to-image", name: "WAN V2.2", description: "5B parameter text-to-image model", icon: Gauge },
];

interface ModelSelectorProps {
  selectedModel: string;
  onSelect: (modelId: string) => void;
}

export const ModelSelector = ({ selectedModel, onSelect }: ModelSelectorProps) => {
  const selectedModelData = AI_MODELS.find(m => m.id === selectedModel) || AI_MODELS[0];
  const SelectedIcon = selectedModelData.icon;

  return (
    <div className="w-full">
      <label className="text-sm font-medium mb-2 block">AI Model</label>
      <Select value={selectedModel} onValueChange={onSelect}>
        <SelectTrigger className="w-full h-auto py-3 bg-background">
          <SelectValue>
            <div className="flex items-center gap-3">
              <SelectedIcon className="w-5 h-5 shrink-0" />
              <div className="flex flex-col items-start gap-0.5">
                <span className="font-semibold text-sm">{selectedModelData.name}</span>
                <span className="text-xs text-muted-foreground">{selectedModelData.description}</span>
              </div>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-background">
          {AI_MODELS.map((model) => {
            const Icon = model.icon;
            return (
              <SelectItem key={model.id} value={model.id} className="py-3 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 shrink-0" />
                  <div className="flex flex-col items-start gap-0.5">
                    <span className="font-semibold text-sm">{model.name}</span>
                    <span className="text-xs text-muted-foreground">{model.description}</span>
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};
