export type AIProviderName = "ollama" | "groq" | "gemini";

export type ChatCitation = {
  segmentId: string;
  pageNumber?: number | null;
  excerpt: string;
  score?: number;
};

export type RetrievedSegment = {
  id: string;
  content: string;
  segmentIndex: number;
  pageNumber: number | null;
  score: number;
};

export type ChatTurn = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type GenerateChatInput = {
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  message: string;
  currentPage?: number;
  history?: ChatTurn[];
};
