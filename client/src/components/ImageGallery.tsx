import generated1 from "@/assets/generated-1.jpg";
import generated2 from "@/assets/generated-2.jpg";
import generated3 from "@/assets/generated-3.jpg";
import generated4 from "@/assets/generated-4.jpg";
import generated5 from "@/assets/generated-5.jpg";
import generated6 from "@/assets/generated-6.jpg";
import { ImageCard } from "./ImageCard";

const MOCK_IMAGES = [
  {
    id: 1,
    src: generated1,
    prompt: "A futuristic neon cyberpunk cityscape at night with glowing purple and cyan lights",
    model: "Midjourney v6",
  },
  {
    id: 2,
    src: generated2,
    prompt: "A majestic fantasy dragon with iridescent scales flying over a mystical mountain landscape",
    model: "DALL-E 3",
  },
  {
    id: 3,
    src: generated3,
    prompt: "A cozy modern coffee shop interior with warm lighting and plants",
    model: "Stable Diffusion XL",
  },
  {
    id: 4,
    src: generated4,
    prompt: "Abstract digital art with flowing liquid metal forms in purple and blue",
    model: "Flux Pro",
  },
  {
    id: 5,
    src: generated5,
    prompt: "A serene Japanese garden with cherry blossoms and Mount Fuji",
    model: "DALL-E 3",
  },
  {
    id: 6,
    src: generated6,
    prompt: "A futuristic AI robot with glowing circuits and holographic interface",
    model: "Midjourney v6",
  },
];

interface ImageGalleryProps {
  onImageClick: (image: typeof MOCK_IMAGES[0]) => void;
}

export const ImageGallery = ({ onImageClick }: ImageGalleryProps) => {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Recent Generations</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-1">
        {MOCK_IMAGES.map((image) => (
          <ImageCard
            key={image.id}
            src={image.src}
            prompt={image.prompt}
            model={image.model}
            onClick={() => onImageClick(image)}
          />
        ))}
      </div>
    </div>
  );
};
