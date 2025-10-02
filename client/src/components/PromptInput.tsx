import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating?: boolean;
}

export const PromptInput = ({ value, onChange, onGenerate, isGenerating }: PromptInputProps) => {
  return (
    <div className="w-full space-y-4">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe the image you want to create..."
        className="min-h-[120px] text-base border-border resize-none focus-visible:ring-black"
      />
      <div className="flex justify-end">
        <Button 
          variant="gradient" 
          size="lg" 
          onClick={onGenerate}
          disabled={isGenerating || !value.trim()}
          className="font-semibold w-full touch-manipulation tap-highlight-none active:scale-95 transition-transform duration-150"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          {isGenerating ? "Generating..." : "Generate Image"}
        </Button>
      </div>
    </div>
  );
};
