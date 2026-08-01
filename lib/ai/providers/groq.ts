import { createGroq } from "@ai-sdk/groq";
import type { LanguageModel } from "ai";

export function createGroqModel(): LanguageModel {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY is missing. Set it in .env or switch AI_PROVIDER to ollama.",
    );
  }
  const groq = createGroq({ apiKey });
  return groq(process.env.GROQ_MODEL || "llama-3.1-8b-instant");
}
