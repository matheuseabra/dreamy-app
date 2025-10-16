import { Router } from "express";
import { CreditService } from "../services/credit-service";
import { ProfileService } from "../services/profile-service";
import { StorageService } from "../services/storage-service";
import { VideoStorageService } from "../services/video-storage-service";
import { BillingService } from "../services/billing-service";
import { stripe } from '../stripe/client';
import supabaseAdmin from "../supabase/client";

const router = Router();
const creditService = new CreditService();
const storageService = new StorageService();
const videoStorageService = new VideoStorageService();
const profileService = new ProfileService();
const billingService = new BillingService();

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

    console.log({ webhookData })

    // Handle different webhook statuses
    if (webhookData.status === "OK") {
      const startTime = new Date(generation.started_at).getTime();

      // Branch based on media type
      if (generation.media_type === 'video') {
        // Handle video generation
        const video = webhookData.payload.video || (webhookData.payload.videos?.[0]);
        console.log("===== VIDEO GENERATION WEBHOOK =======")
        console.log(video)
        console.log("===== VIDEO GENERATION WEBHOOK =======")

        if (!video?.url) {
          throw new Error('No video URL in webhook payload');
        }

        const videoId = crypto.randomUUID();

        // Upload video to storage
        const { originalPath, metadata } = await videoStorageService.uploadFromUrl(
          generation.user_id,
          generationId,
          videoId,
          video.url
        );

        // Create video record
        await supabaseAdmin.from("videos").insert({
          id: videoId,
          generation_id: generationId,
          user_id: generation.user_id,
          storage_path: originalPath,
          url: video.url,
          content_type: video.content_type,
          format: video.content_type?.includes('webm') ? 'webm' : 'mp4',
          file_size_bytes: video.file_size || metadata.size,
          width: video.width,
          height: video.height,
          duration_seconds: video.duration,
          fps: video.fps,
          fal_metadata: {
            seed: webhookData.payload.seed,
            prompt: webhookData.prompt || generation.prompt,
            ...video,
          },
        });

        console.log('Video generation completed:', { generationId, videoId });
      } else {
        // Handle image generation (existing logic)
        const images = webhookData.payload.images || [];

        // Upload images and create records
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          const imageId = crypto.randomUUID();

          // Upload to storage from fal URL (now returns both paths)
          const { originalPath, webpPath, metadata } = await storageService.uploadFromUrl(
            generation.user_id,
            generationId,
            imageId,
            image.url,
            i
          );

          // Create image record with both paths
          await supabaseAdmin.from("images").insert({
            id: imageId,
            generation_id: generationId,
            user_id: generation.user_id,
            storage_path: originalPath,
            webp_path: webpPath,
            optimized_size: metadata.size,
            url: image.url,
            width: metadata.width || image.width,
            height: metadata.height || image.height,
            content_type: image.content_type,
            fal_metadata: {
              seed: webhookData.seed,
              has_nsfw_concepts: webhookData.has_nsfw_concepts,
              prompt: webhookData.prompt,
              ...image,
            },
          });
        }

        console.log('Image generation completed:', { generationId, imageCount: images.length });
      }

      // Update generation status (common for both image and video)
      const duration = Date.now() - startTime;
      await supabaseAdmin
        .from("generations")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          duration_ms: duration,
        })
        .eq("id", generationId);

      // Deduct credits (common for both image and video)
      await creditService.deductCredits(
        generation.user_id,
        generation.credits_used
      );

      res.json({ success: true, message: `${generation.media_type} generation completed` });
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

// Supabase auth webhook handler (to react to user signups)
router.post('/supabase', async (req, res) => {
  try {
    const event = req.body;

    // Supabase sends an 'event' object wrapper: { "credentials":..., "event": { "type": "...", "record": {...} } }
    // But some setups post the event directly. Handle both shapes.
    const payload = event.event || event;

    const eventType = payload.type || payload.event_type || null;
    const record = payload.record || payload.data || payload.user || payload;

    // Only care about user signup/create events
    if (eventType === 'user.created' || eventType === 'auth.user.created' || eventType === 'user_created') {
      const user = record || payload;
      try {
        await profileService.createProfileOnSignup(user);
      } catch (err: any) {
        console.error('Failed to create profile on signup:', err.message || err);
        // don't fail the webhook; log and return 200 to supabase
      }
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('Supabase webhook handling error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add this route to existing webhook router
router.post('/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).json({ error: 'No signature' });
  }

  let event: any;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Checkout session completed:', session.id);

        // Process the payment
        await billingService.processSuccessfulPayment(session.id);
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.error('Payment failed:', failedPayment.id);

        // Update transaction status
        await supabaseAdmin
          .from('credit_transactions')
          .update({
            status: 'failed',
            metadata: { error: failedPayment.last_payment_error },
          })
          .eq('stripe_payment_intent_id', failedPayment.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
