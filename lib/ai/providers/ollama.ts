import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

export function createOllamaModel(): LanguageModel {
  const baseURL = (
    process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434"
  ).replace(/\/$/, "");
  const ollama = createOpenAI({
    baseURL: `${baseURL}/v1`,
    apiKey: process.env.OLLAMA_API_KEY || "ollama",
  });
  return ollama(process.env.OLLAMA_MODEL || "llama3.2");
}
