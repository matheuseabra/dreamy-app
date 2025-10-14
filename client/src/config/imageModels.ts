
import fluxDevThumb from "@/assets/model-thumbs/flux-dev-thumb.webp";
import fluxKontextThumb from "@/assets/model-thumbs/flux-kontext-thumb.webp";
import flexSchnellThumb from "@/assets/model-thumbs/flux-schnell-thumb.webp";
import ideogram3Thumb from "@/assets/model-thumbs/ideogram3-thumb.webp";
import imagen4Thumb from "@/assets/model-thumbs/imagen4-thumb.webp";
import nanoBananaThumb from "@/assets/model-thumbs/nano-banana-thumb.webp";
import recraft3Thumb from "@/assets/model-thumbs/recraft-3-thumb.webp";
import seedDream4Thumb from "@/assets/model-thumbs/seed-dream-4-thumb.webp";
import wan22Thumb from "@/assets/model-thumbs/wan-22-thumb.webp";

export const TEXT_TO_IMAGE_MODELS = [
  {
    id: "fal-ai/flux/dev",
    name: "Flux Dev",
    description: "High quality text-to-image generation",
    type: "text-to-image",
    thumb: fluxDevThumb,
  },
  {
    id: "fal-ai/flux/schnell",
    name: "Flux Schnell",
    description: "Fast text-to-image generation",
    type: "text-to-image",
    thumb: flexSchnellThumb,
  },
  {
    id: "fal-ai/flux-pro/kontext",
    name: "Flux Pro Kontext",
    description: "Professional context-aware generation",
    type: "text-to-image",
    thumb: fluxKontextThumb,
  },
  {
    id: "fal-ai/flux-pro/kontext/max",
    name: "Flux Pro Kontext Max",
    description: "Maximum quality context generation",
    type: "text-to-image",
    thumb: fluxKontextThumb,
  },
    {
    id: "fal-ai/flux/krea",
    name: "Flux Krea",
    description: "Creative text-to-image generation",
    type: "text-to-image",
    thumb: fluxDevThumb,
  },
  {
    id: "fal-ai/recraft/v3/text-to-image",
    name: "Recraft V3",
    description: "Advanced text-to-image generation",
    type: "text-to-image",
    thumb: recraft3Thumb,
  },
  {
    id: "fal-ai/ideogram/v3",
    name: "Ideogram V3",
    description: "Latest text rendering capabilities",
    type: "text-to-image",
    thumb: ideogram3Thumb,
  },
  {
    id: "fal-ai/nano-banana",
    name: "Nano Banana",
    description: "Lightweight fast generation",
    type: "text-to-image",
    thumb: nanoBananaThumb,
  },
  {
    id: "fal-ai/wan-2-2",
    name: "WAN 2.2",
    description: "High fidelity and detail generation",
    type: "text-to-image",
    thumb: wan22Thumb,
  },
  {
    id: "fal-ai/bytedance/dreamina/v3.1/text-to-image",
    name: "Dreamina V3.1",
    description: "Text-to-image generation by Bytedance",
    type: "text-to-image",
    thumb: fluxDevThumb,
  },
  {
    id: "fal-ai/bytedance/seedream/v4/text-to-image",
    name: "Seedream V4",
    description: "Advanced text-to-image generation by Bytedance",
    type: "text-to-image",
    thumb: seedDream4Thumb,
  },
  {
    id: "fal-ai/imagen4/preview/ultra",
    name: "Imagen4 Ultra",
    description: "High-quality text-to-image generation",
    type: "text-to-image",
    thumb: imagen4Thumb,
  }
];

export const IMAGE_TO_IMAGE_MODELS = [
  {
    id: "fal-ai/flux/dev/image-to-image",
    name: "Flux Dev",
    description: "FLUX.1 [dev] image-to-image endpoint",
    type: "image-to-image",
    thumb: fluxDevThumb,
  },
  {
    id: "fal-ai/flux-general/image-to-image",
    name: "Flux General",
    description: "FLUX.1 [dev] with ControlNets / LoRAs",
    type: "image-to-image",
    thumb: fluxKontextThumb,
  },
  {
    id: "fal-ai/flux-lora/image-to-image",
    name: "Flux LoRA",
    description: "FLUX.1 [dev] + LoRA adaptation",
    type: "image-to-image",
    thumb: fluxKontextThumb,
  },
  {
    id: "fal-ai/ideogram/character",
    name: "Ideogram Character",
    description: "Ideogram V3 Character (consistent characters)",
    type: "image-to-image",
    thumb: ideogram3Thumb,
  },
  {
    id: "fal-ai/recraft/v3/image-to-image",
    name: "Recraft V3",
    description: "Recraft V3 image-to-image endpoint",
    type: "image-to-image",
    thumb: recraft3Thumb,
  },
   {
    id: "fal-ai/nano-banana/edit",
    name: "Nano Banana Edit",
    description: "Edit version of Nano Banana",
    type: "image-to-image", 
    thumb: nanoBananaThumb,
  },
  {
    id: "fal-ai/bytedance/seededit/v3/edit-image",
    name: "Bytedance Seededit V3",
    description: "Edit version of Bytedance Seededit",
    type: "image-to-image", 
    thumb: fluxDevThumb,
  },
  {
    id: "fal-ai/bytedance/seedream/v4/edit",
    name: "Bytedance Seedream V4 Edit",
    description: "Edit version of Bytedance Seedream",
    type: "image-to-image",
    thumb: seedDream4Thumb,
  }
];

export const SIZE_LABEL: Record<string, string> = {
  square_hd: "1:1 HD",
  square: "1:1",
  portrait_4_3: "3:4",
  portrait_16_9: "9:16",
  landscape_4_3: "4:3",
  landscape_16_9: "16:9",
};