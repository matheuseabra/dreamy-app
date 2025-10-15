import { Router } from "express";

import { authenticateUser, AuthRequest } from "../middleware/auth";

import { validateBody } from "../middleware/validate";

import { createError } from "../middleware/error-handler";
import { generateLimiter } from "../middleware/rate-limit";
import { CreditService } from "../services/credit-service";
import { FalService } from "../services/fal-service";
import { StorageService } from "../services/storage-service";
import supabaseAdmin from "../supabase/client";
import { generateImageSchema } from "../types/validation";
import { handleGenerationResult } from "../utils/generation";

const router = Router();
const creditService = new CreditService();
const falService = new FalService();
const storageService = new StorageService();

router.post(
  "/",
  authenticateUser,
  generateLimiter,
  validateBody(generateImageSchema),
  async (req: AuthRequest, res) => {
    const userId = req.user!.id;
    let generationId: string | null = null;

    try {
      const input = req.body;
      const creditsRequired = input.num_images || 1;

      const hasCredits = await creditService.checkCredits(
        userId,
        creditsRequired
      );
      if (!hasCredits) {
        throw createError("Insufficient credits", 402);
      }

      const { data: generation, error: genError } = await supabaseAdmin
        .from("generations")
        .insert({
          user_id: userId,
          model: input.model,
          prompt: input.prompt,
          negative_prompt: input.negative_prompt,
          image_size: input.image_size,
          num_images: input.num_images || 1,
          seed: input.seed,
          guidance_scale: input.guidance_scale,
          num_inference_steps: input.num_inference_steps,
          model_options: input.modelOptions || {},
          status: "pending",
          credits_used: creditsRequired,
          source_image_url: input.source_image_url || null,
        })
        .select()
        .single();

      if (genError) throw genError;
      generationId = generation.id;

      // Build webhook URL for async processing
      const webhookUrl = process.env.WEBHOOK_BASE_URL
        ? `${process.env.WEBHOOK_BASE_URL}/api/webhooks/fal/${generationId}`
        : undefined;

      // Submit to Fal queue or run synchronously
      if (input.sync_mode) {
        const startTime = Date.now();

        const result = await falService.subscribe(input);

        await handleGenerationResult(
          userId,
          generationId,
          result.data,
          result.requestId,
          startTime
        );

        await creditService.deductCredits(userId, creditsRequired);

        // Get updated generation with images
        const { data: updatedGen } = await supabaseAdmin
          .from("generations")
          .select("*, images(*)")
          .eq("id", generationId)
          .single();

        const imagesWithUrls = await Promise.all(
          (updatedGen?.images || []).map(async (img: any) => ({
            id: img.id,
            url: await storageService.getSignedUrl(img.storage_path, 3600),
            width: img.width,
            height: img.height,
          }))
        );

        res.json({
          success: true,
          generation: {
            id: generationId,
            status: "completed",
            images: imagesWithUrls,
          },
        });
      } else {
        // Async mode - submit to queue
        const requestId = await falService.submitGeneration(input, webhookUrl);

        // Update generation with fal request ID
        await supabaseAdmin
          .from("generations")
          .update({
            fal_request_id: requestId,
            status: "in_queue",
          })
          .eq("id", generationId);

        res.json({
          success: true,
          generation: {
            id: generationId,
            status: "in_queue",
            falRequestId: requestId,
            message:
              "Generation queued successfully. Use the status endpoint to check progress.",
          },
        });
      }
    } catch (error: any) {
      console.error("Generation error:", error);

      if (generationId) {
        await supabaseAdmin
          .from("generations")
          .update({
            status: "failed",
            error_message: error.message,
            completed_at: new Date().toISOString(),
          })
          .eq("id", generationId);
      }

      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        error: error.message || "Failed to generate image",
      });
    }
  }
);

// Get generation status
router.get("/:id", authenticateUser, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const generationId = req.params.id;

    const { data: generation, error } = await supabaseAdmin
      .from("generations")
      .select("*")
      .eq("id", generationId)
      .eq("user_id", userId)
      .single();

    if (error || !generation) {
      return res.status(404).json({
        success: false,
        error: "Generation not found",
      });
    }

    // If generation is queued, get latest status from Fal
    if (
      generation.fal_request_id &&
      (generation.status === "in_queue" || generation.status === "processing")
    ) {
      try {
        const falStatus = await falService.getStatus(
          generation.model,
          generation.fal_request_id
        );

        console.log("Fal status:", falStatus);

        // Update status in database
        await supabaseAdmin
          .from("generations")
          .update({
            status:
              falStatus.status === "IN_PROGRESS"
                ? "processing"
                : generation.status,
          })
          .eq("id", generationId);

        generation.status =
          falStatus.status === "IN_PROGRESS" ? "processing" : generation.status;
      } catch (err) {
        console.error("Failed to get Fal status:", err);
      }
    }

    // Get associated images if completed
    let images = null;
    if (generation.status === "completed") {
      const { data: imageData } = await supabaseAdmin
        .from("images")
        .select("*")
        .eq("generation_id", generationId);

      if (imageData) {
        images = await Promise.all(
          imageData.map(async (img) => ({
            id: img.id,
            url: await storageService.getSignedUrl(img.storage_path, 3600),
            width: img.width,
            height: img.height,
          }))
        );
      }
    }

    res.json({
      success: true,
      generation: {
        id: generation.id,
        status: generation.status,
        queuePosition: generation.queue_position,
        prompt: generation.prompt,
        model: generation.model,
        error: generation.error_message,
        images,
        createdAt: generation.created_at,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Cancel generation
router.delete("/:id", authenticateUser, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const generationId = req.params.id;

    const { data: generation, error } = await supabaseAdmin
      .from("generations")
      .select("*")
      .eq("id", generationId)
      .eq("user_id", userId)
      .single();

    if (error || !generation) {
      return res.status(404).json({
        success: false,
        error: "Generation not found",
      });
    }

    if (
      generation.status !== "in_queue" &&
      generation.status !== "processing"
    ) {
      return res.status(400).json({
        success: false,
        error: "Can only cancel queued or processing generations",
      });
    }

    if (generation.fal_request_id) {
      try {
        await falService.cancelRequest(
          generation.model,
          generation.fal_request_id
        );
      } catch (err) {
        console.error("Failed to cancel Fal request:", err);
      }
    }

    // Update status
    await supabaseAdmin
      .from("generations")
      .update({
        status: "failed",
        error_message: "Cancelled by user",
        completed_at: new Date().toISOString(),
      })
      .eq("id", generationId);

    // Refund credits
    await creditService.refundCredits(userId, generation.credits_used);

    res.json({
      success: true,
      message: "Generation cancelled successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
