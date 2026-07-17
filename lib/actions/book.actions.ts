'use server';

import { CreateBook, TextSegment } from "@/types";
import { generateSlug, serializeData } from "@/lib/utils";
import { prisma } from "@/lib/db";
import type { Book, BookSegment } from "@prisma/client";

type BookWithId = Book & { _id: string };
type SegmentWithId = BookSegment & { _id: string };

const withBookId = (book: Book): BookWithId => ({
  ...book,
  _id: book.id,
});

const withSegmentId = (segment: BookSegment): SegmentWithId => ({
  ...segment,
  _id: segment.id,
});

export const getAllBooks = async (search?: string) => {
  try {
    const query = search?.trim();

    const books = await prisma.book.findMany({
      where: query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { author: { contains: query, mode: "insensitive" } },
            ],
          }
        : undefined,
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

export const checkBookExists = async (title: string) => {
  try {
    const slug = generateSlug(title);
    const existingBook = await prisma.book.findUnique({ where: { slug } });

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
    const slug = generateSlug(data.title);
    const existingBook = await prisma.book.findUnique({ where: { slug } });

    if (existingBook) {
      return {
        success: true,
        data: serializeData(withBookId(existingBook)),
        alreadyExists: true,
      };
    }

    const book = await prisma.book.create({
      data: {
        title: data.title,
        author: data.author,
        persona: data.persona,
        fileURL: data.fileURL,
        fileBlobKey: data.fileBlobKey,
        coverURL: data.coverURL,
        coverBlobKey: data.coverBlobKey,
        fileSize: data.fileSize,
        slug,
        totalSegments: 0,
      },
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
    const book = await prisma.book.findUnique({ where: { slug } });

    if (!book) {
      return { success: false, error: "Book not found" };
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

export const saveBookSegments = async (
  bookId: string,
  segments: TextSegment[],
) => {
  try {
    console.log("Saving book segments...");

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

    console.log("Book segments saved successfully.");

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
    console.log(`Searching for: "${query}" in book ${bookId}`);

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

    console.log(`Search complete. Found ${segments.length} results`);

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
