import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GenerationSettingsProps {
  size: string;
  quality: string;
  style: string;
  onSizeChange: (value: string) => void;
  onQualityChange: (value: string) => void;
  onStyleChange: (value: string) => void;
}

export const GenerationSettings = ({
  size,
  quality,
  style,
  onSizeChange,
  onQualityChange,
  onStyleChange,
}: GenerationSettingsProps) => {
  return (
    <div className="w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="size">Image Size</Label>
        <Select value={size} onValueChange={onSizeChange}>
          <SelectTrigger id="size" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="square">Square (1024×1024)</SelectItem>
            <SelectItem value="portrait">Portrait (1024×1536)</SelectItem>
            <SelectItem value="landscape">Landscape (1536×1024)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="quality">Quality</Label>
        <Select value={quality} onValueChange={onQualityChange}>
          <SelectTrigger id="quality" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="hd">HD</SelectItem>
            <SelectItem value="ultra">Ultra HD</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="style">Style</Label>
        <Select value={style} onValueChange={onStyleChange}>
          <SelectTrigger id="style" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="natural">Natural</SelectItem>
            <SelectItem value="vivid">Vivid</SelectItem>
            <SelectItem value="artistic">Artistic</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
