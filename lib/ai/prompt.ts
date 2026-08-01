export function buildSystemPrompt(input: {
  bookTitle: string;
  bookAuthor: string;
  currentPage?: number;
  context: string;
}): string {
  const pageHint =
    input.currentPage && input.currentPage > 0
      ? `The reader is currently on page ${input.currentPage}. Prefer that context when relevant.`
      : "";

  return `You are BookBy's AI reading companion for the book "${input.bookTitle}" by ${input.bookAuthor}.

Rules:
- Answer using ONLY the provided book passages.
- If the passages are insufficient, say what is missing instead of inventing facts.
- Be clear, concise, and helpful for studying.
- When you rely on a passage, mention the page number if available (e.g. "Page 42").
- Use markdown when helpful (lists, short headings, code/math only when needed).
${pageHint}

Book passages:
${input.context}`;
}
