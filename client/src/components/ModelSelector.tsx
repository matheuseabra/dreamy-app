import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Sparkles, Gauge } from "lucide-react";

const AI_MODELS = [
  { id: "dalle", name: "Flux Schnell", description: "Fast & good quality", icon: Zap },
  { id: "midjourney", name: "Flux Dev", description: "Better quality, slower", icon: Sparkles },
  { id: "flux", name: "Flux Pro", description: "Best quality, slowest", icon: Gauge },
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
