import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getBookForMutation } from "@/lib/book-access";
import { streamBookChat } from "@/lib/ai/chat";
import type { ChatCitation } from "@/lib/ai/types";

export const runtime = "nodejs";
export const maxDuration = 60;

type ChatRequestBody = {
  bookId?: string;
  sessionId?: string | null;
  message?: string;
  currentPage?: number;
  regenerate?: boolean;
};

function titleFromMessage(message: string) {
  const cleaned = message.replace(/\s+/g, " ").trim();
  if (!cleaned) return "New chat";
  return cleaned.length > 60 ? `${cleaned.slice(0, 57)}…` : cleaned;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequestBody;
    const bookId = body.bookId?.trim();
    const message = body.message?.trim();
    const currentPage =
      typeof body.currentPage === "number" && body.currentPage > 0
        ? Math.floor(body.currentPage)
        : undefined;

    if (!bookId || !message) {
      return NextResponse.json(
        { error: "bookId and message are required." },
        { status: 400 },
      );
    }

    const { error, book, session } = await getBookForMutation(bookId);
    if (error || !book || !session) {
      return NextResponse.json(
        { error: error === "Unauthorized" ? "Please sign in." : "Book not found." },
        { status: error === "Unauthorized" ? 401 : 404 },
      );
    }

    let chatSession =
      body.sessionId
        ? await prisma.chatSession.findFirst({
            where: {
              id: body.sessionId,
              bookId: book.id,
              userId: session.user.id,
            },
          })
        : null;

    if (!chatSession) {
      chatSession = await prisma.chatSession.create({
        data: {
          bookId: book.id,
          userId: session.user.id,
          title: titleFromMessage(message),
        },
      });
    } else if (!chatSession.title || chatSession.title === "New chat") {
      await prisma.chatSession.update({
        where: { id: chatSession.id },
        data: { title: titleFromMessage(message) },
      });
    }

    if (body.regenerate) {
      const lastAssistant = await prisma.chatMessage.findFirst({
        where: { sessionId: chatSession.id, role: "assistant" },
        orderBy: { createdAt: "desc" },
      });
      if (lastAssistant) {
        await prisma.chatMessage.delete({ where: { id: lastAssistant.id } });
      }
    } else {
      await prisma.chatMessage.create({
        data: {
          sessionId: chatSession.id,
          role: "user",
          content: message,
        },
      });
    }

    const prior = await prisma.chatMessage.findMany({
      where: { sessionId: chatSession.id },
      orderBy: { createdAt: "asc" },
      take: 20,
    });

    const history = prior
      .filter((row) => row.role === "user" || row.role === "assistant")
      .slice(0, -1)
      .map((row) => ({
        role: row.role as "user" | "assistant",
        content: row.content,
      }));

    const { result, citations } = await streamBookChat({
      bookId: book.id,
      bookTitle: book.title,
      bookAuthor: book.author,
      message,
      currentPage,
      history,
    });

    const sessionId = chatSession.id;
    const citationPayload: ChatCitation[] = citations.filter(
      (citation) => citation.pageNumber != null || citation.excerpt.length > 0,
    );

    void Promise.resolve(result.text)
      .then(async (fullText) => {
        try {
          await prisma.chatMessage.create({
            data: {
              sessionId,
              role: "assistant",
              content: fullText,
              citations: citationPayload,
            },
          });
          await prisma.chatSession.update({
            where: { id: sessionId },
            data: { updatedAt: new Date() },
          });
        } catch (persistError) {
          console.error("Failed to persist assistant message", persistError);
        }
      })
      .catch((streamError: unknown) => {
        console.error("Chat stream failed", streamError);
      });

    return result.toTextStreamResponse({
      headers: {
        "X-Chat-Session-Id": sessionId,
        "X-Chat-Citations": encodeURIComponent(JSON.stringify(citationPayload)),
      },
    });
  } catch (error) {
    console.error("POST /api/books/chat", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate a response.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
