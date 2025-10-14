import gptImageThumb from "@/assets/gpt-image-1-thumb.webp";
import { DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { IMAGE_TO_IMAGE_MODELS, TEXT_TO_IMAGE_MODELS } from "@/config/imageModels";

const ModelItem = ({
  model,
  isSelected,
  onSelect,
}: {
  model: (typeof TEXT_TO_IMAGE_MODELS)[0] | (typeof IMAGE_TO_IMAGE_MODELS)[0];
  isSelected: boolean;
  onSelect: () => void;
}) => {
  return (
    <DropdownMenuRadioItem
      value={model.id}
      className="cursor-pointer h-20 flex items-center gap-3 px-3 py-2"
    >
      <div className="flex items-center justify-center">
        <img
          src={model.thumb || gptImageThumb}
          alt={`${model.name} thumb`}
          className="h-10 w10 object-cover rounded-full"
        />
      </div>
      <div className="flex flex-col justify-center gap-0.5 flex-1 min-w-0">
        <span className="text-sm font-medium truncate">{model.name}</span>
        <span className="text-xs text-muted-foreground truncate">
          {model.description}
        </span>
        {/* <Badge variant="default" className="text-xs px-2 py-0 mt-1 w-fit self-start whitespace-nowrap bg-primary/20 text-primary border border-primary">
          {model.type === "text-to-image" ? "text-to-image" : "image-to-image"}
        </Badge> */}
      </div>
    </DropdownMenuRadioItem>
  );
};

export default ModelItem;
