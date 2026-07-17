'use server';

import { EndSessionResult, StartSessionResult } from "@/types";
import { prisma } from "@/lib/db";

const DEFAULT_MAX_DURATION_MINUTES = 15;

export const startVoiceSession = async (
  bookId: string,
): Promise<StartSessionResult> => {
  try {
    const session = await prisma.voiceSession.create({
      data: {
        bookId,
        startedAt: new Date(),
        durationSeconds: 0,
      },
    });

    return {
      success: true,
      sessionId: session.id,
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
    const result = await prisma.voiceSession.updateMany({
      where: { id: sessionId },
      data: {
        endedAt: new Date(),
        durationSeconds,
      },
    });

    if (result.count === 0) {
      return { success: false, error: "Voice session not found." };
    }

    return { success: true };
  } catch (e) {
    console.error("Error ending voice session", e);
    return {
      success: false,
      error: "Failed to end voice session. Please try again later.",
    };
  }
};
