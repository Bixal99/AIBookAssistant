import { prisma } from "@/lib/db";
import type { ChatCitation, RetrievedSegment } from "@/lib/ai/types";

const MAX_SEGMENTS = 8;
const EXCERPT_CHARS = 220;
const NEARBY_PAGE_WINDOW = 2;

function scoreSegment(
  content: string,
  keywords: string[],
  pageNumber: number | null,
  currentPage?: number,
): number {
  const lower = content.toLowerCase();
  let score = 0;

  for (const keyword of keywords) {
    if (!keyword) continue;
    if (lower.includes(keyword)) {
      score += 3;
      const matches = lower.split(keyword).length - 1;
      score += Math.min(matches, 3);
    }
  }

  if (currentPage && pageNumber) {
    const distance = Math.abs(pageNumber - currentPage);
    if (distance === 0) score += 8;
    else if (distance <= NEARBY_PAGE_WINDOW) score += 5 - distance;
  }

  return score;
}

function toExcerpt(content: string): string {
  const cleaned = content.replace(/\s+/g, " ").trim();
  if (cleaned.length <= EXCERPT_CHARS) return cleaned;
  return `${cleaned.slice(0, EXCERPT_CHARS).trim()}…`;
}

export async function retrieveBookContext(
  bookId: string,
  query: string,
  currentPage?: number,
): Promise<{ segments: RetrievedSegment[]; citations: ChatCitation[] }> {
  const keywords = query
    .split(/\s+/)
    .map((k) => k.trim().toLowerCase())
    .filter((k) => k.length > 2);

  const keywordHits =
    keywords.length > 0
      ? await prisma.bookSegment.findMany({
          where: {
            bookId,
            OR: keywords.map((keyword) => ({
              content: { contains: keyword, mode: "insensitive" as const },
            })),
          },
          take: 40,
          orderBy: { segmentIndex: "asc" },
        })
      : [];

  let nearby: typeof keywordHits = [];
  if (currentPage && currentPage > 0) {
    nearby = await prisma.bookSegment.findMany({
      where: {
        bookId,
        pageNumber: {
          gte: Math.max(1, currentPage - NEARBY_PAGE_WINDOW),
          lte: currentPage + NEARBY_PAGE_WINDOW,
        },
      },
      take: 12,
      orderBy: { segmentIndex: "asc" },
    });
  }

  // Fallback: if nothing matched and no nearby pages, take early segments
  let fallback: typeof keywordHits = [];
  if (keywordHits.length === 0 && nearby.length === 0) {
    fallback = await prisma.bookSegment.findMany({
      where: { bookId },
      take: 6,
      orderBy: { segmentIndex: "asc" },
    });
  }

  const byId = new Map<string, (typeof keywordHits)[number]>();
  for (const segment of [...keywordHits, ...nearby, ...fallback]) {
    byId.set(segment.id, segment);
  }

  const scored: RetrievedSegment[] = [...byId.values()]
    .map((segment) => ({
      id: segment.id,
      content: segment.content,
      segmentIndex: segment.segmentIndex,
      pageNumber: segment.pageNumber,
      score: scoreSegment(
        segment.content,
        keywords,
        segment.pageNumber,
        currentPage,
      ),
    }))
    .sort((a, b) => b.score - a.score || a.segmentIndex - b.segmentIndex)
    .slice(0, MAX_SEGMENTS);

  const citations: ChatCitation[] = scored
    .filter((segment) => segment.score > 0 || segment.pageNumber != null)
    .map((segment) => ({
      segmentId: segment.id,
      pageNumber: segment.pageNumber,
      excerpt: toExcerpt(segment.content),
      score: segment.score,
    }));

  return { segments: scored, citations };
}

export function formatContextForPrompt(segments: RetrievedSegment[]): string {
  if (segments.length === 0) {
    return "No matching passages were found in this book.";
  }

  return segments
    .map((segment, index) => {
      const pageLabel =
        segment.pageNumber != null ? `page ${segment.pageNumber}` : "page unknown";
      return `[Source ${index + 1} | ${pageLabel} | id:${segment.id}]\n${segment.content}`;
    })
    .join("\n\n");
}
