import { createFal } from "@ai-sdk/fal";
import { createOpenAI } from "@ai-sdk/openai";

export function getProvider(providerName: string) {
  switch (providerName.toLowerCase()) {
    case "openai":
      return createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    case "fal":
      return createFal({
        apiKey: process.env.FAL_API_KEY,
      });
    case "replicate":
      return createOpenAI({
        apiKey: process.env.REPLICATE_API_KEY,
        baseURL: "https://api.replicate.com/v1",
      });
    default:
      throw new Error(`Unsupported provider: ${providerName}`);
  }
}
