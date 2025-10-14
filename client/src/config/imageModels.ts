import fluxDevThumb from "@/assets/flux-dev-thumb.webp";
import fluxKontextThumb from "@/assets/flux-kontext-thumb.webp";
import flexSchnellThumb from "@/assets/flux-schnell-thumb.webp";
import ideogram3Thumb from "@/assets/ideogram-3-thumb.webp";
import nanoBananaThumb from "@/assets/nano-banana-thumb.webp";
import recraft3Thumb from "@/assets/recraft-thumb.webp";
import wan22Thumb from "@/assets/wan-22-thumb.webp";
import {
    Brush,
    Crown,
    Gauge, Image, Palette,
    Rocket,
    Sparkles,
    Star,
    User,
    Zap
} from "lucide-react";

export const TEXT_TO_IMAGE_MODELS = [
  {
    id: "fal-ai/flux/dev",
    name: "Flux Dev",
    description: "High quality text-to-image generation",
    icon: Sparkles,
    type: "text-to-image",
    thumb: fluxDevThumb,
  },
  {
    id: "fal-ai/flux/schnell",
    name: "Flux Schnell",
    description: "Fast text-to-image generation",
    icon: Zap,
    type: "text-to-image",
    thumb: flexSchnellThumb,
  },
  {
    id: "fal-ai/flux-pro/kontext",
    name: "Flux Pro Kontext",
    description: "Professional context-aware generation",
    icon: Crown,
    type: "text-to-image",
    thumb: fluxKontextThumb,
  },
  {
    id: "fal-ai/flux-pro/kontext/max",
    name: "Flux Pro Kontext Max",
    description: "Maximum quality context generation",
    icon: Star,
    type: "text-to-image",
    thumb: fluxKontextThumb,
  },
  {
    id: "fal-ai/recraft/v3/text-to-image",
    name: "Recraft V3",
    description: "Advanced text-to-image generation",
    icon: Brush,
    type: "text-to-image",
    thumb: recraft3Thumb,
  },
  {
    id: "fal-ai/ideogram/v3",
    name: "Ideogram V3",
    description: "Latest text rendering capabilities",
    icon: Rocket,
    type: "text-to-image",
    thumb: ideogram3Thumb,
  },
  {
    id: "fal-ai/nano-banana",
    name: "Nano Banana",
    description: "Lightweight fast generation",
    icon: Zap,
    type: "text-to-image",
    thumb: nanoBananaThumb,
  },
  {
    id: "fal-ai/wan/v2.2-5b/text-to-image",
    name: "WAN V2.2",
    description: "5B parameter text-to-image model",
    icon: Gauge,
    type: "text-to-image",
    thumb: wan22Thumb,
  },
];

export const IMAGE_TO_IMAGE_MODELS = [
  {
    id: "fal-ai/flux/dev/image-to-image",
    name: "Flux Dev",
    description: "FLUX.1 [dev] image-to-image endpoint",
    icon: Image,
    type: "image-to-image",
    thumb: fluxDevThumb,
  },
  {
    id: "fal-ai/flux-general/image-to-image",
    name: "Flux General",
    description: "FLUX.1 [dev] with ControlNets / LoRAs",
    icon: Palette,
    type: "image-to-image",
    thumb: fluxKontextThumb,
  },
  {
    id: "fal-ai/flux-lora/image-to-image",
    name: "Flux LoRA",
    description: "FLUX.1 [dev] + LoRA adaptation",
    icon: Sparkles,
    type: "image-to-image",
    thumb: fluxKontextThumb,
  },
  {
    id: "fal-ai/ideogram/character",
    name: "Ideogram Character",
    description: "Ideogram V3 Character (consistent characters)",
    icon: User,
    type: "image-to-image",
    thumb: ideogram3Thumb,
  },
  {
    id: "fal-ai/recraft/v3/image-to-image",
    name: "Recraft V3",
    description: "Recraft V3 image-to-image endpoint",
    icon: Brush,
    type: "image-to-image",
    thumb: recraft3Thumb,
  },
];

export const SIZE_LABEL: Record<string, string> = {
  square_hd: "1:1 HD",
  square: "1:1",
  portrait_4_3: "3:4",
  portrait_9_16: "9:16",
  landscape_4_3: "4:3",
  landscape_16_9: "16:9",
};