"use client";

import { BookOpen } from "lucide-react";

import type { ChatCitation } from "@/types";
import { cn } from "@/lib/utils";

type CitationListProps = {
  citations: ChatCitation[];
  onJumpToPage?: (page: number) => void;
  className?: string;
};

export default function CitationList({
  citations,
  onJumpToPage,
  className,
}: CitationListProps) {
  if (!citations.length) return null;

  const withPages = citations.filter(
    (citation) => citation.pageNumber != null && citation.pageNumber > 0,
  );
  const uniquePages = [
    ...new Map(
      withPages.map((citation) => [citation.pageNumber, citation]),
    ).values(),
  ].slice(0, 6);

  const withoutPages = citations
    .filter((citation) => citation.pageNumber == null || citation.pageNumber <= 0)
    .slice(0, 3);

  if (uniquePages.length === 0 && withoutPages.length === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-[10px] font-semibold tracking-[0.14em] text-[var(--text-secondary)] uppercase">
        Sources
      </p>
      <div className="flex flex-wrap gap-1.5">
        {uniquePages.map((citation) => (
          <button
            key={`${citation.segmentId}-${citation.pageNumber}`}
            type="button"
            onClick={() => {
              if (citation.pageNumber && onJumpToPage) {
                onJumpToPage(citation.pageNumber);
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--landing-parchment-deep)] px-2.5 py-1 text-[11px] font-medium text-[var(--landing-maroon)] transition-colors hover:bg-[var(--landing-maroon-soft)]"
            title={citation.excerpt}
          >
            <BookOpen className="size-3" />
            Page {citation.pageNumber}
          </button>
        ))}
        {uniquePages.length === 0
          ? withoutPages.map((citation) => (
              <span
                key={citation.segmentId}
                className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--landing-parchment-deep)] px-2.5 py-1 text-[11px] text-[var(--text-secondary)]"
                title={citation.excerpt}
              >
                Passage
              </span>
            ))
          : null}
      </div>
    </div>
  );
}
