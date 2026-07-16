import { del } from "@vercel/blob";
import type { Book } from "@prisma/client";

import { prisma } from "@/lib/db";
import { getSession, isAdmin } from "@/lib/auth-session";
import { generateSlug } from "@/lib/utils";

export type SessionUser = {
  id: string;
  role?: string | null;
};

export async function requireAuthSession() {
  const session = await getSession();
  if (!session?.user?.id) {
    return null;
  }
  return session;
}

export function canAccessBook(
  book: Pick<Book, "userId">,
  userId: string,
  admin: boolean,
) {
  return admin || book.userId === userId;
}

export async function getOwnedBookBySlug(slug: string) {
  const session = await requireAuthSession();
  if (!session) {
    return { error: "Unauthorized" as const, book: null, session: null };
  }

  const admin = isAdmin(session);
  const book = await prisma.book.findFirst({
    where: admin
      ? { slug }
      : { slug, userId: session.user.id },
    include: {
      categories: { include: { category: true } },
    },
  });

  if (!book) {
    return { error: "Book not found" as const, book: null, session };
  }

  if (!canAccessBook(book, session.user.id, admin)) {
    return { error: "Forbidden" as const, book: null, session };
  }

  return { error: null, book, session };
}

export async function getBookForMutation(bookId: string) {
  const session = await requireAuthSession();
  if (!session) {
    return { error: "Unauthorized" as const, book: null, session: null };
  }

  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book) {
    return { error: "Book not found" as const, book: null, session };
  }

  const admin = isAdmin(session);
  if (!canAccessBook(book, session.user.id, admin)) {
    return { error: "Forbidden" as const, book: null, session };
  }

  return { error: null, book, session };
}

export function normalizeCategoryName(raw: string) {
  return raw.trim().replace(/\s+/g, " ");
}

export function categorySlugFromName(name: string) {
  return generateSlug(name.toLowerCase());
}

export async function deleteBookBlobs(book: {
  fileBlobKey: string;
  coverBlobKey?: string | null;
}) {
  const keys = [book.fileBlobKey, book.coverBlobKey].filter(
    (key): key is string => typeof key === "string" && key.length > 0,
  );
  if (keys.length === 0) return;
  try {
    await del(keys);
  } catch (err) {
    console.error("Failed to delete blob files", err);
  }
}
