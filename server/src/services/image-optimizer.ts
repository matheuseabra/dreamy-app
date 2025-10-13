import sharp from 'sharp';

export class ImageOptimizer {
  private readonly WEBP_QUALITY = 85;
  private readonly WEBP_EFFORT = 4;

  async optimizeToWebP(inputBuffer: Buffer): Promise<{
    webpBuffer: Buffer;
    metadata: { width: number; height: number; size: number };
  }> {
    try {
      // Convert to WebP with optimization
      const webpBuffer = await sharp(inputBuffer)
        .webp({
          quality: this.WEBP_QUALITY,
          effort: this.WEBP_EFFORT,
        })
        .toBuffer();

      // Get metadata from optimized image
      const metadata = await sharp(webpBuffer).metadata();

      return {
        webpBuffer,
        metadata: {
          width: metadata.width || 0,
          height: metadata.height || 0,
          size: webpBuffer.length,
        },
      };
    } catch (error) {
      console.error('WebP optimization failed, using original:', error);
      // Return original buffer as fallback
      const metadata = await sharp(inputBuffer).metadata();
      return {
        webpBuffer: inputBuffer,
        metadata: {
          width: metadata.width || 0,
          height: metadata.height || 0,
          size: inputBuffer.length,
        },
      };
    }
  }
}
