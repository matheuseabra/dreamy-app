import { Router } from "express";
import { CreditService } from "../services/credit-service";
import { StorageService } from "../services/storage-service";
import supabaseAdmin from "../supabase/client";

const router = Router();
const creditService = new CreditService();
const storageService = new StorageService();

// Fal webhook handler
router.post("/fal/:generationId", async (req, res) => {
  try {
    const generationId = req.params.generationId;
    const webhookData = req.body;

    console.log("Received Fal webhook:", {
      generationId,
      status: webhookData.status,
    });

    // Get generation from database
    const { data: generation, error } = await supabaseAdmin
      .from("generations")
      .select("*")
      .eq("id", generationId)
      .single();

    if (error || !generation) {
      console.error("Generation not found:", generationId);
      return res.status(404).json({ error: "Generation not found" });
    }

    // Handle different webhook statuses
    if (webhookData.status === "OK") {
      const startTime = new Date(generation.started_at).getTime();
      const images = webhookData.payload.images || [];

      // Upload images and create records
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const imageId = crypto.randomUUID();

        // Upload to storage from fal URL
        const storagePath = await storageService.uploadFromUrl(
          generation.user_id,
          generationId,
          imageId,
          image.url,
          i
        );

        // Create image record
        await supabaseAdmin.from("images").insert({
          id: imageId,
          generation_id: generationId,
          user_id: generation.user_id,
          storage_path: storagePath,
          url: image.url,
          width: image.width,
          height: image.height,
          content_type: image.content_type,
          fal_metadata: {
            seed: webhookData.seed,
            has_nsfw_concepts: webhookData.has_nsfw_concepts,
            prompt: webhookData.prompt,
            ...image,
          },
        });
      }

      // Update generation status
      const duration = Date.now() - startTime;
      await supabaseAdmin
        .from("generations")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          duration_ms: duration,
        })
        .eq("id", generationId);

      // Deduct credits
      await creditService.deductCredits(
        generation.user_id,
        generation.credits_used
      );

      res.json({ success: true, message: "Generation completed" });
    } else if (webhookData.status === "ERROR") {
      // Update generation status to failed
      await supabaseAdmin
        .from("generations")
        .update({
          status: "failed",
          error_message: webhookData.error || "Generation failed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", generationId);

      res.json({ success: true, message: "Generation failed" });
    } else {
      res.json({ success: true, message: "Webhook received" });
    }
  } catch (error: any) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
