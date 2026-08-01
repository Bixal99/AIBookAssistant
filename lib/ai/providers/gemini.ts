import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { LanguageModel } from "ai";

export function createGeminiModel(): LanguageModel {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GOOGLE_GENERATIVE_AI_API_KEY is missing. Set it in .env or switch AI_PROVIDER to ollama.",
    );
  }
  const google = createGoogleGenerativeAI({ apiKey });
  return google(process.env.GEMINI_MODEL || "gemini-2.0-flash");
}
