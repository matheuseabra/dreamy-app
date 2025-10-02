import { experimental_generateImage as generateImageFn } from "ai";
import { Request, Response } from "express";
import { saveGeneratedImages } from "../services/generated-images-service";
import supabase from "../supabase/client";
import { getProvider } from "../utils";

const SUPABASE_IMAGES_BUCKET = process.env.SUPABASE_IMAGES_BUCKET || "public-images";
const SUPABASE_URL = process.env.SUPABASE_URL || "";

const generateImage = async (req: Request, res: Response) => {
  try {
    const {
      provider = "openai",
      model,
      prompt,
      size,
      aspectRatio,
      n = 1,
      seed,
      providerOptions = {},
      maxImagesPerCall,
      timeout = 60000, // 60 seconds default
    } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        success: false,
        error: "Prompt is required and must be a string",
      });
    }

    if (!model || typeof model !== "string") {
      return res.status(400).json({
        success: false,
        error: "Model is required and must be a string",
      });
    }

    let providerInstance;
    try {
      providerInstance = getProvider(provider);
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    const options: any = {
      model: providerInstance.image(model),
      prompt,
    };

    if (size) options.size = size;
    if (aspectRatio) options.aspectRatio = aspectRatio;
    if (n) options.n = n;
    if (seed !== undefined) options.seed = seed;
    if (maxImagesPerCall) options.maxImagesPerCall = maxImagesPerCall;

    if (providerOptions && Object.keys(providerOptions).length > 0) {
      options.providerOptions = providerOptions;
    }

    if (timeout) {
      options.abortSignal = AbortSignal.timeout(timeout);
    }

    const result = await generateImageFn(options);
    
    const images = result.images || [result.image];
    
    const formattedImages = await Promise.all(
      images.map(async (img: any, index: number) => {
        const buffer = Buffer.from(img.base64, "base64");
        const key = `${Date.now()}_${crypto.randomUUID()}_${index}.png`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(SUPABASE_IMAGES_BUCKET)
          .upload(key, buffer, {
            contentType: "image/png",
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        let hostedUrl: string | null = uploadData?.fullPath ?? null;

        const imageData: any = {
          url: `${SUPABASE_URL}/storage/v1/object/public/${hostedUrl}`,
        };

      // Include provider-specific metadata if available
      const metadata: any =
        result.providerMetadata?.[provider]?.images?.[index];
      if (metadata) {
        if (metadata.width) imageData.width = metadata.width;
        if (metadata.height) imageData.height = metadata.height;
        if (metadata.revisedPrompt)
          imageData.revisedPrompt = metadata.revisedPrompt;
        if (metadata.nsfw !== undefined) imageData.nsfw = metadata.nsfw;
        if (metadata.content_type)
          imageData.contentType = metadata.content_type;
      }

        return imageData;
      })
    );

    try {
      const userId =
        req.body && req.body.userId ? String(req.body.userId) : null;

      const imageInputs = formattedImages.map((img) => ({
        url: img.url,
        b64_json: null,
        size: size ?? null,
        quality: req.body && req.body.quality ? String(req.body.quality) : null,
        style: req.body && req.body.style ? String(req.body.style) : null,
      }));

      await saveGeneratedImages(userId, imageInputs, prompt, model);
    } catch (e: any) {
      console.error("Failed to save generated images:", e?.message || e);
    }
    
    const response: any = {
      success: true,
      images: formattedImages,
    };

    if (result.warnings && result.warnings.length > 0) {
      response.warnings = result.warnings;
    }

    if (result.providerMetadata) {
      response.providerMetadata = result.providerMetadata;
    }

    res.json(response);
  } catch (error: any) {
    console.error("Image generation error:", error);

    // Handle timeout errors
    if (error.name === "AbortError") {
      return res.status(408).json({
        success: false,
        error: "Request timeout - image generation took too long",
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate image",
      details: error.cause || null,
    });
  }
};

const getGeneratedImages = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("generated_images")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    return res.json(data);
  } catch (error: any) {
    console.error("Failed to fetch images from Supabase:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch images",
    });
  }
};

export default { generateImage, getGeneratedImages };
