import type { LanguageModel } from "ai";

import type { AIProviderName } from "@/lib/ai/types";
import { createGeminiModel } from "@/lib/ai/providers/gemini";
import { createGroqModel } from "@/lib/ai/providers/groq";
import { createOllamaModel } from "@/lib/ai/providers/ollama";

function readProvider(): AIProviderName {
  const raw = (process.env.AI_PROVIDER || "ollama").toLowerCase().trim();
  if (raw === "groq" || raw === "gemini" || raw === "ollama") {
    return raw;
  }
  return "ollama";
}

export function getConfiguredProviderName(): AIProviderName {
  return readProvider();
}

export function getChatModel(): LanguageModel {
  const provider = readProvider();

  if (provider === "groq") {
    return createGroqModel();
  }

  if (provider === "gemini") {
    return createGeminiModel();
  }

  return createOllamaModel();
}

export function getProviderSetupHint(): string {
  const provider = readProvider();
  if (provider === "ollama") {
    return "Start Ollama locally and pull a model (e.g. `ollama pull llama3.2`), then set OLLAMA_MODEL if needed.";
  }
  if (provider === "groq") {
    return "Add GROQ_API_KEY to your environment.";
  }
  return "Add GOOGLE_GENERATIVE_AI_API_KEY to your environment.";
}
