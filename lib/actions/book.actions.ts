'use server';

import { CreateBook, TextSegment } from "@/types";
import { generateSlug, serializeData } from "@/lib/utils";
import { prisma } from "@/lib/db";
import type { Book, BookSegment, ReadingProgress } from "@prisma/client";
import {
  categorySlugFromName,
  deleteBookBlobs,
  getBookForMutation,
  getOwnedBookBySlug,
  normalizeCategoryName,
  requireAuthSession,
} from "@/lib/book-access";
import { isAdmin } from "@/lib/auth-session";
import { createNotification } from "@/lib/notifications";

type BookWithId = Book & { _id: string };
type SegmentWithId = BookSegment & { _id: string };
type ReadingProgressWithId = ReadingProgress & { _id: string };

const withBookId = (book: Book): BookWithId => ({
  ...book,
  _id: book.id,
});

const withSegmentId = (segment: BookSegment): SegmentWithId => ({
  ...segment,
  _id: segment.id,
});

const withReadingProgressId = (
  progress: ReadingProgress,
): ReadingProgressWithId => ({
  ...progress,
  _id: progress.id,
});

async function upsertCategoryLink(bookId: string, categoryInput?: string) {
  const name = categoryInput ? normalizeCategoryName(categoryInput) : "";
  if (!name) return;

  const slug = categorySlugFromName(name);
  if (!slug) return;

  const category = await prisma.category.upsert({
    where: { slug },
    create: { name, slug },
    update: { name },
  });

  await prisma.bookCategory.upsert({
    where: {
      bookId_categoryId: { bookId, categoryId: category.id },
    },
    create: { bookId, categoryId: category.id },
    update: {},
  });
}

export const getAllBooks = async (search?: string) => {
  try {
    const session = await requireAuthSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const query = search?.trim();
    const books = await prisma.book.findMany({
      where: {
        userId: session.user.id,
        ...(query
          ? {
              OR: [
                { title: { contains: query, mode: "insensitive" } },
                { author: { contains: query, mode: "insensitive" } },
                {
                  categories: {
                    some: {
                      category: {
                        name: { contains: query, mode: "insensitive" },
                      },
                    },
                  },
                },
              ],
            }
          : {}),
      },
      include: {
        categories: { include: { category: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: serializeData(books.map(withBookId)),
    };
  } catch (e) {
    console.error("Error fetching books", e);
    return {
      success: false,
      error: e,
    };
  }
};

export const getAllBooksAdmin = async () => {
  try {
    const session = await requireAuthSession();
    if (!session || !isAdmin(session)) {
      return { success: false, error: "Forbidden" };
    }

    const books = await prisma.book.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        categories: { include: { category: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: serializeData(books.map(withBookId)),
    };
  } catch (e) {
    console.error("Error fetching admin books", e);
    return { success: false, error: e };
  }
};

export const checkBookExists = async (title: string) => {
  try {
    const session = await requireAuthSession();
    if (!session) {
      return { exists: false, error: "Unauthorized" };
    }

    const slug = generateSlug(title);
    const existingBook = await prisma.book.findUnique({
      where: {
        userId_slug: { userId: session.user.id, slug },
      },
    });

    if (existingBook) {
      return {
        exists: true,
        book: serializeData(withBookId(existingBook)),
      };
    }

    return { exists: false };
  } catch (e) {
    console.error("Error checking book exists", e);
    return { exists: false, error: e };
  }
};

export const createBook = async (data: CreateBook) => {
  try {
    const session = await requireAuthSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const slug = generateSlug(data.title);
    const existingBook = await prisma.book.findUnique({
      where: {
        userId_slug: { userId: session.user.id, slug },
      },
    });

    if (existingBook) {
      return {
        success: true,
        data: serializeData(withBookId(existingBook)),
        alreadyExists: true,
      };
    }

    const book = await prisma.book.create({
      data: {
        userId: session.user.id,
        title: data.title,
        author: data.author,
        persona: data.persona,
        fileURL: data.fileURL,
        fileBlobKey: data.fileBlobKey,
        coverURL: data.coverURL,
        coverBlobKey: data.coverBlobKey,
        fileSize: data.fileSize,
        coverFileSize: data.coverFileSize ?? 0,
        slug,
        totalSegments: 0,
      },
    });

    await upsertCategoryLink(book.id, data.category);

    await createNotification({
      userId: session.user.id,
      type: "BOOK_UPLOADED",
      title: "Book uploaded successfully",
      message: `"${book.title}" is in your library.`,
      link: `/books/${book.slug}`,
    });

    return {
      success: true,
      data: serializeData(withBookId(book)),
    };
  } catch (e) {
    console.error("Error creating a book", e);
    return {
      success: false,
      error: e,
    };
  }
};

export const getBookBySlug = async (slug: string) => {
  try {
    const { error, book } = await getOwnedBookBySlug(slug);

    if (error || !book) {
      return { success: false, error: error ?? "Book not found" };
    }

    return {
      success: true,
      data: serializeData(withBookId(book)),
    };
  } catch (e) {
    console.error("Error fetching book by slug", e);
    return {
      success: false,
      error: e,
    };
  }
};

export const getBookWorkspaceBySlug = async (slug: string) => {
  try {
    const { error, book, session } = await getOwnedBookBySlug(slug);

    if (error || !book || !session) {
      return { success: false, error: error ?? "Book not found" };
    }

    const progress = await prisma.readingProgress.upsert({
      where: {
        userId_bookId: { userId: session.user.id, bookId: book.id },
      },
      create: {
        userId: session.user.id,
        bookId: book.id,
        currentPage: 1,
        totalPages: 0,
        percentage: 0,
        lastOpenedAt: new Date(),
      },
      update: {
        lastOpenedAt: new Date(),
      },
    });

    return {
      success: true,
      data: serializeData({
        ...withBookId(book),
        readingProgress: withReadingProgressId(progress),
      }),
    };
  } catch (e) {
    console.error("Error fetching book workspace", e);
    return {
      success: false,
      error: e,
    };
  }
};

export const updateBookMetadata = async (
  bookId: string,
  data: { title?: string; author?: string; category?: string },
) => {
  try {
    const { error, book, session } = await getBookForMutation(bookId);
    if (error || !book || !session) {
      return { success: false, error: error ?? "Unauthorized" };
    }

    const title = data.title?.trim() || book.title;
    const author = data.author?.trim() || book.author;
    const slug = generateSlug(title);

    if (slug !== book.slug) {
      const conflict = await prisma.book.findUnique({
        where: {
          userId_slug: { userId: book.userId, slug },
        },
      });
      if (conflict && conflict.id !== book.id) {
        return { success: false, error: "A book with this title already exists." };
      }
    }

    const updated = await prisma.book.update({
      where: { id: book.id },
      data: { title, author, slug },
    });

    if (data.category !== undefined) {
      await prisma.bookCategory.deleteMany({ where: { bookId: book.id } });
      await upsertCategoryLink(book.id, data.category);
    }

    return {
      success: true,
      data: serializeData(withBookId(updated)),
    };
  } catch (e) {
    console.error("Error updating book metadata", e);
    return { success: false, error: e };
  }
};

export const deleteBook = async (bookId: string) => {
  try {
    const { error, book } = await getBookForMutation(bookId);
    if (error || !book) {
      return { success: false, error: error ?? "Unauthorized" };
    }

    await deleteBookBlobs(book);
    await prisma.book.delete({ where: { id: book.id } });

    return { success: true };
  } catch (e) {
    console.error("Error deleting book", e);
    return { success: false, error: e };
  }
};

export const recordBookOpen = async (bookId: string) => {
  try {
    const session = await requireAuthSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      return { success: false, error: "Book not found" };
    }

    const admin = isAdmin(session);
    if (!admin && book.userId !== session.user.id) {
      return { success: false, error: "Forbidden" };
    }

    await prisma.readingProgress.upsert({
      where: {
        userId_bookId: { userId: session.user.id, bookId },
      },
      create: {
        userId: session.user.id,
        bookId,
        currentPage: 1,
        totalPages: 0,
        percentage: 0,
        lastOpenedAt: new Date(),
      },
      update: { lastOpenedAt: new Date() },
    });

    return { success: true };
  } catch (e) {
    console.error("Error recording book open", e);
    return { success: false, error: e };
  }
};

export const saveBookSegments = async (
  bookId: string,
  segments: TextSegment[],
) => {
  try {
    const { error, book, session } = await getBookForMutation(bookId);
    if (error || !book || !session) {
      return { success: false, error: error ?? "Unauthorized" };
    }

    await prisma.bookSegment.createMany({
      data: segments.map(({ text, segmentIndex, pageNumber, wordCount }) => ({
        bookId,
        content: text,
        segmentIndex,
        pageNumber,
        wordCount,
      })),
    });

    await prisma.book.update({
      where: { id: bookId },
      data: { totalSegments: segments.length },
    });

    await createNotification({
      userId: session.user.id,
      type: "PDF_PROCESSED",
      title: "PDF processing finished",
      message: `"${book.title}" is ready for voice chat.`,
      link: `/books/${book.slug}`,
    });

    return {
      success: true,
      data: { segmentsCreated: segments.length },
    };
  } catch (e) {
    console.error("Error saving book segments", e);
    return {
      success: false,
      error: e,
    };
  }
};

export const searchBookSegments = async (
  bookId: string,
  query: string,
  limit: number = 5,
) => {
  try {
    const { error } = await getBookForMutation(bookId);
    if (error) {
      return { success: false, error, data: [] };
    }

    const keywords = query
      .split(/\s+/)
      .map((k) => k.trim())
      .filter((k) => k.length > 2);

    const segments = await prisma.bookSegment.findMany({
      where: {
        bookId,
        OR:
          keywords.length > 0
            ? keywords.map((keyword) => ({
                content: { contains: keyword, mode: "insensitive" as const },
              }))
            : [{ content: { contains: query, mode: "insensitive" as const } }],
      },
      select: {
        id: true,
        bookId: true,
        content: true,
        segmentIndex: true,
        pageNumber: true,
        wordCount: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { segmentIndex: "asc" },
      take: limit,
    });

    return {
      success: true,
      data: serializeData(segments.map(withSegmentId)),
    };
  } catch (error) {
    console.error("Error searching segments:", error);
    return {
      success: false,
      error: (error as Error).message,
      data: [],
    };
  }
};
