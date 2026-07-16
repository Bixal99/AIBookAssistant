'use server';

import { EndSessionResult, StartSessionResult } from "@/types";
import { prisma } from "@/lib/db";
import { getBookForMutation, requireAuthSession } from "@/lib/book-access";
import { createNotification } from "@/lib/notifications";

const DEFAULT_MAX_DURATION_MINUTES = 15;

export const startVoiceSession = async (
  bookId: string,
): Promise<StartSessionResult> => {
  try {
    const { error, session } = await getBookForMutation(bookId);
    if (error || !session) {
      return {
        success: false,
        error: error === "Unauthorized" ? "Please sign in." : "Book not found.",
      };
    }

    const voiceSession = await prisma.voiceSession.create({
      data: {
        bookId,
        userId: session.user.id,
        startedAt: new Date(),
        durationSeconds: 0,
      },
    });

    return {
      success: true,
      sessionId: voiceSession.id,
      maxDurationMinutes: DEFAULT_MAX_DURATION_MINUTES,
    };
  } catch (e) {
    console.error("Error starting voice session", e);
    return {
      success: false,
      error: "Failed to start voice session. Please try again later.",
    };
  }
};

export const endVoiceSession = async (
  sessionId: string,
  durationSeconds: number,
): Promise<EndSessionResult> => {
  try {
    const auth = await requireAuthSession();
    if (!auth) {
      return { success: false, error: "Please sign in." };
    }

    const existing = await prisma.voiceSession.findFirst({
      where: { id: sessionId, userId: auth.user.id },
      include: { book: { select: { title: true, slug: true } } },
    });

    if (!existing) {
      return { success: false, error: "Voice session not found." };
    }

    await prisma.voiceSession.update({
      where: { id: sessionId },
      data: {
        endedAt: new Date(),
        durationSeconds,
      },
    });

    const mins = Math.floor(durationSeconds / 60);
    const secs = Math.floor(durationSeconds % 60);
    const durationLabel = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    await createNotification({
      userId: auth.user.id,
      type: "VOICE_SESSION",
      title: "Voice session completed",
      message: `Finished talking with "${existing.book.title}" (${durationLabel}).`,
      link: `/books/${existing.book.slug}`,
    });

    return { success: true };
  } catch (e) {
    console.error("Error ending voice session", e);
    return {
      success: false,
      error: "Failed to end voice session. Please try again later.",
    };
  }
};
