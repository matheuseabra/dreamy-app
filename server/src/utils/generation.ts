import crypto from 'crypto';
import { StorageService } from '../services/storage-service';
import supabaseAdmin from '../supabase/client';

const storageService = new StorageService();

export async function handleGenerationResult(
  userId: string,
  generationId: string,
  data: any,
  falRequestId: string,
  startTime: number
) {
  const images = data.images || [];

  // Upload images and create records
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const imageId = crypto.randomUUID();

    // Upload to storage from fal URL (now returns both paths)
    const { originalPath, webpPath, metadata } = await storageService.uploadFromUrl(
      userId,
      generationId,
      imageId,
      image.url,
      i
    );

    // Create image record with both paths
    await supabaseAdmin.from('images').insert({
      id: imageId,
      generation_id: generationId,
      user_id: userId,
      storage_path: originalPath,
      webp_path: webpPath,
      optimized_size: metadata.size,
      url: image.url,
      width: metadata.width || image.width,
      height: metadata.height || image.height,
      content_type: image.content_type,
      fal_metadata: {
        seed: data.seed,
        has_nsfw_concepts: data.has_nsfw_concepts,
        prompt: data.prompt,
        ...image,
      },
    });
  }

  // Update generation status
  const duration = Date.now() - startTime;
  await supabaseAdmin
    .from('generations')
    .update({
      fal_request_id: falRequestId,
      status: 'completed',
      completed_at: new Date().toISOString(),
      duration_ms: duration,
    })
    .eq('id', generationId);
}
