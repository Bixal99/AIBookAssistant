import type { NotificationType } from "@prisma/client";

import { prisma } from "@/lib/db";

export async function createNotification(input: {
  userId: string;
  type: NotificationType;
  title: string;
  message?: string;
  link?: string;
}) {
  try {
    return await prisma.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        title: input.title,
        message: input.message,
        link: input.link,
      },
    });
  } catch (err) {
    console.error("Failed to create notification", err);
    return null;
  }
}
