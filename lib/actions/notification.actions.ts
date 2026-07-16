"use server";

import { prisma } from "@/lib/db";
import { requireAuthSession } from "@/lib/book-access";
import { serializeData } from "@/lib/utils";

export async function listNotifications(limit = 20) {
  const session = await requireAuthSession();
  if (!session) return { success: false as const, error: "Unauthorized", data: [] };

  const items = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return { success: true as const, data: serializeData(items) };
}

export async function getUnreadCount() {
  const session = await requireAuthSession();
  if (!session) return { success: false as const, count: 0 };

  const count = await prisma.notification.count({
    where: { userId: session.user.id, isRead: false },
  });

  return { success: true as const, count };
}

export async function markNotificationRead(id: string) {
  const session = await requireAuthSession();
  if (!session) return { success: false as const, error: "Unauthorized" };

  await prisma.notification.updateMany({
    where: { id, userId: session.user.id },
    data: { isRead: true },
  });

  return { success: true as const };
}

export async function markAllNotificationsRead() {
  const session = await requireAuthSession();
  if (!session) return { success: false as const, error: "Unauthorized" };

  await prisma.notification.updateMany({
    where: { userId: session.user.id, isRead: false },
    data: { isRead: true },
  });

  return { success: true as const };
}
