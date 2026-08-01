import { streamText, type ModelMessage } from "ai";

import { getChatModel, getProviderSetupHint } from "@/lib/ai/provider";
import { buildSystemPrompt } from "@/lib/ai/prompt";
import {
  formatContextForPrompt,
  retrieveBookContext,
} from "@/lib/ai/rag";
import type { ChatCitation, GenerateChatInput } from "@/lib/ai/types";

export async function prepareBookChat(input: GenerateChatInput): Promise<{
  messages: ModelMessage[];
  citations: ChatCitation[];
  model: ReturnType<typeof getChatModel>;
}> {
  const { segments, citations } = await retrieveBookContext(
    input.bookId,
    input.message,
    input.currentPage,
  );

  const context = formatContextForPrompt(segments);
  const system = buildSystemPrompt({
    bookTitle: input.bookTitle,
    bookAuthor: input.bookAuthor,
    currentPage: input.currentPage,
    context,
  });

  const history = (input.history || [])
    .filter((turn) => turn.role === "user" || turn.role === "assistant")
    .slice(-8)
    .map((turn) => ({
      role: turn.role as "user" | "assistant",
      content: turn.content,
    }));

  const messages: ModelMessage[] = [
    { role: "system", content: system },
    ...history,
    { role: "user", content: input.message },
  ];

  let model: ReturnType<typeof getChatModel>;
  try {
    model = getChatModel();
  } catch (error) {
    const hint = getProviderSetupHint();
    const message =
      error instanceof Error ? error.message : "AI provider is not configured.";
    throw new Error(`${message} ${hint}`);
  }

  return { messages, citations, model };
}

export async function streamBookChat(input: GenerateChatInput) {
  const prepared = await prepareBookChat(input);

  const result = streamText({
    model: prepared.model,
    messages: prepared.messages,
    temperature: 0.3,
  });

  return {
    result,
    citations: prepared.citations,
  };
}
