'use server';

import { prisma } from "@/lib/db";
import { getBookForMutation, requireAuthSession } from "@/lib/book-access";
import { serializeData } from "@/lib/utils";
import type { ChatCitation } from "@/lib/ai/types";

function withIds<T extends { id: string }>(row: T) {
  return { ...row, _id: row.id };
}

export async function listChatSessions(bookId: string) {
  try {
    const { error, session } = await getBookForMutation(bookId);
    if (error || !session) {
      return { success: false, error: error ?? "Unauthorized", data: [] };
    }

    const sessions = await prisma.chatSession.findMany({
      where: { bookId, userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      take: 30,
    });

    return {
      success: true,
      data: serializeData(sessions.map(withIds)),
    };
  } catch (error) {
    console.error("listChatSessions", error);
    return { success: false, error: "Failed to load chat sessions.", data: [] };
  }
}

export async function getChatMessages(sessionId: string) {
  try {
    const auth = await requireAuthSession();
    if (!auth) {
      return { success: false, error: "Unauthorized", data: [] };
    }

    const chatSession = await prisma.chatSession.findFirst({
      where: { id: sessionId, userId: auth.user.id },
    });

    if (!chatSession) {
      return { success: false, error: "Chat session not found.", data: [] };
    }

    const messages = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
    });

    return {
      success: true,
      data: serializeData(
        messages.map((message) => ({
          ...withIds(message),
          citations: (message.citations as ChatCitation[] | null) ?? null,
        })),
      ),
    };
  } catch (error) {
    console.error("getChatMessages", error);
    return { success: false, error: "Failed to load messages.", data: [] };
  }
}

export async function createChatSession(bookId: string, title?: string) {
  try {
    const { error, book, session } = await getBookForMutation(bookId);
    if (error || !book || !session) {
      return { success: false, error: error ?? "Unauthorized" };
    }

    const chatSession = await prisma.chatSession.create({
      data: {
        bookId: book.id,
        userId: session.user.id,
        title: title?.trim() || "New chat",
      },
    });

    return {
      success: true,
      data: serializeData(withIds(chatSession)),
    };
  } catch (error) {
    console.error("createChatSession", error);
    return { success: false, error: "Failed to create chat session." };
  }
}

export async function renameChatSession(sessionId: string, title: string) {
  try {
    const auth = await requireAuthSession();
    if (!auth) {
      return { success: false, error: "Unauthorized" };
    }

    const existing = await prisma.chatSession.findFirst({
      where: { id: sessionId, userId: auth.user.id },
    });

    if (!existing) {
      return { success: false, error: "Chat session not found." };
    }

    const nextTitle = title.replace(/\s+/g, " ").trim().slice(0, 80) || "Untitled chat";
    const updated = await prisma.chatSession.update({
      where: { id: sessionId },
      data: { title: nextTitle },
    });

    return {
      success: true,
      data: serializeData(withIds(updated)),
    };
  } catch (error) {
    console.error("renameChatSession", error);
    return { success: false, error: "Failed to rename chat session." };
  }
}

export async function deleteChatSession(sessionId: string) {
  try {
    const auth = await requireAuthSession();
    if (!auth) {
      return { success: false, error: "Unauthorized" };
    }

    const existing = await prisma.chatSession.findFirst({
      where: { id: sessionId, userId: auth.user.id },
    });

    if (!existing) {
      return { success: false, error: "Chat session not found." };
    }

    await prisma.chatSession.delete({ where: { id: sessionId } });
    return { success: true };
  } catch (error) {
    console.error("deleteChatSession", error);
    return { success: false, error: "Failed to delete chat session." };
  }
}

export async function getLatestChatForBook(bookId: string) {
  try {
    const { error, session } = await getBookForMutation(bookId);
    if (error || !session) {
      return { success: false, error: error ?? "Unauthorized" };
    }

    const chatSession = await prisma.chatSession.findFirst({
      where: { bookId, userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          take: 100,
        },
      },
    });

    if (!chatSession) {
      return { success: true, data: null };
    }

    return {
      success: true,
      data: serializeData({
        ...withIds(chatSession),
        messages: chatSession.messages.map((message) => ({
          ...withIds(message),
          citations: (message.citations as ChatCitation[] | null) ?? null,
        })),
      }),
    };
  } catch (error) {
    console.error("getLatestChatForBook", error);
    return { success: false, error: "Failed to load chat." };
  }
}
