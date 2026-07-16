'use server';

import { prisma } from "@/lib/db";
import { getBookForMutation, requireAuthSession } from "@/lib/book-access";

type UpdateReadingProgressInput = {
  bookId: string;
  currentPage: number;
  totalPages: number;
};

const clampPage = (page: number, totalPages: number) => {
  const safeTotal = Math.max(0, Math.floor(totalPages || 0));
  if (safeTotal === 0) {
    return Math.max(1, Math.floor(page || 1));
  }

  return Math.min(Math.max(1, Math.floor(page || 1)), safeTotal);
};

export async function updateReadingProgress({
  bookId,
  currentPage,
  totalPages,
}: UpdateReadingProgressInput) {
  try {
    const { error, book, session } = await getBookForMutation(bookId);
    if (error || !book || !session) {
      return { success: false, error: error ?? "Unauthorized" };
    }

    const safeTotalPages = Math.max(0, Math.floor(totalPages || 0));
    const safeCurrentPage = clampPage(currentPage, safeTotalPages);
    const percentage =
      safeTotalPages > 0
        ? Math.min(100, Math.max(0, (safeCurrentPage / safeTotalPages) * 100))
        : 0;

    const progress = await prisma.readingProgress.upsert({
      where: {
        userId_bookId: { userId: session.user.id, bookId: book.id },
      },
      create: {
        userId: session.user.id,
        bookId: book.id,
        currentPage: safeCurrentPage,
        totalPages: safeTotalPages,
        percentage,
        lastOpenedAt: new Date(),
        completedAt: percentage >= 100 ? new Date() : null,
      },
      update: {
        currentPage: safeCurrentPage,
        totalPages: safeTotalPages,
        percentage,
        lastOpenedAt: new Date(),
        completedAt: percentage >= 100 ? new Date() : null,
      },
    });

    return { success: true, data: progress };
  } catch (error) {
    console.error("Error updating reading progress", error);
    return { success: false, error: "Failed to update reading progress." };
  }
}

export async function startReadingSession(bookId: string) {
  try {
    const { error, book, session } = await getBookForMutation(bookId);
    if (error || !book || !session) {
      return { success: false, error: error ?? "Unauthorized" };
    }

    const readingSession = await prisma.readingSession.create({
      data: {
        bookId: book.id,
        userId: session.user.id,
      },
    });

    return { success: true, sessionId: readingSession.id };
  } catch (error) {
    console.error("Error starting reading session", error);
    return { success: false, error: "Failed to start reading session." };
  }
}

export async function endReadingSession(
  sessionId: string,
  durationSeconds: number,
) {
  try {
    const session = await requireAuthSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const existing = await prisma.readingSession.findFirst({
      where: {
        id: sessionId,
        userId: session.user.id,
      },
    });

    if (!existing) {
      return { success: false, error: "Reading session not found." };
    }

    await prisma.readingSession.update({
      where: { id: sessionId },
      data: {
        endedAt: new Date(),
        durationSeconds: Math.max(0, Math.floor(durationSeconds || 0)),
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error ending reading session", error);
    return { success: false, error: "Failed to end reading session." };
  }
}
