import supabase from "../supabase/client";

type ImageInput = {
  url: string;
  b64_json?: string;
  size?: string | null;
  quality?: string | null;
  style?: string | null;
};

/**
 * Save generated images to the generated_images table.
 * Keeps backwards compatibility with previous callers that only passed url and optional b64_json.
 *
 * DB columns: id (uuid), image_url, prompt, model, size, quality, style, created_at, user_id
 */
const saveGeneratedImages = async (
  userId: string | null,
  images: Array<ImageInput>,
  prompt: string,
  model: string
) => {
  const now = new Date().toISOString();

  const dbImages = images.map(img => ({
    id: crypto.randomUUID(),
    user_id: userId,
    image_url: img.url,
    image_b64: img.b64_json || null,
    prompt,
    model,
    size: img.size ?? null,
    quality: img.quality ?? null,
    style: img.style ?? null,
    created_at: now
  }));

  // Insert and return the rows inserted (supabase client returns data and error)
  const { data, error } = await supabase.from('generated_images').insert(dbImages).select('*');

  if (error) {
    throw error;
  }

  // Return the rows as saved in the DB (with possibly generated defaults)
  return data;
}

export { saveGeneratedImages };
