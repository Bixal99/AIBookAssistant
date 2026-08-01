"use client";

import Link from "next/link";
import { Expand, MessageSquare } from "lucide-react";

import BookCover from "@/components/BookCover";
import VapiControls from "@/components/VapiControls";
import AIChatPanel from "@/components/workspace/AIChatPanel";
import { Button } from "@/components/ui/button";
import { formatDurationLabel } from "@/lib/utils";
import type { WorkspaceBook } from "@/components/workspace/types";

type AssistantPanelProps = {
  book: WorkspaceBook;
  currentPage: number;
  totalPages: number;
  percentage: number;
  readingSeconds: number;
  onJumpToPage?: (page: number) => void;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AssistantPanel({
  book,
  currentPage,
  totalPages,
  percentage,
  readingSeconds,
  onJumpToPage,
}: AssistantPanelProps) {
  const categories = book.categories?.map((entry) => entry.category.name) ?? [];
  const chatHref = `/books/${book.slug}/chat`;

  return (
    <aside className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-card text-card-foreground shadow-sm">
      <div className="flex shrink-0 items-start justify-between gap-2 border-b border-[var(--border-subtle)] px-4 py-3.5">
        <div className="min-w-0">
          <h2 className="font-serif text-lg font-semibold text-[var(--landing-ink)]">
            Assistant
          </h2>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Voice and text chat for this book
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          size="xs"
          className="shrink-0 rounded-full"
        >
          <Link href={chatHref} title="Open full assistant page">
            <Expand className="size-3" />
            Full chat
          </Link>
        </Button>
      </div>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4 [scrollbar-width:thin]">
        <section className="rounded-2xl bg-[var(--landing-parchment-deep)] p-4">
          <div className="flex gap-3">
            <BookCover
              src={book.coverURL}
              title={book.title}
              width={56}
              height={84}
              className="h-[84px] w-14 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-serif text-base font-semibold text-[var(--landing-ink)]">
                {book.title}
              </p>
              <p className="mt-0.5 truncate text-xs text-[var(--text-secondary)]">
                {book.author}
              </p>
              <p className="mt-3 text-xs leading-relaxed text-[var(--text-secondary)]">
                Page {currentPage}
                {totalPages > 0 ? ` / ${totalPages}` : ""} ·{" "}
                {percentage.toFixed(0)}% · {formatDurationLabel(readingSeconds)} ·{" "}
                {formatBytes(book.fileSize)}
              </p>
            </div>
          </div>
          {categories.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full bg-card px-2.5 py-1 text-[11px] font-medium text-[var(--landing-maroon)]"
                >
                  {category}
                </span>
              ))}
            </div>
          ) : null}
        </section>

        <section className="space-y-3">
          <h3 className="text-[10px] font-semibold tracking-[0.16em] text-[var(--text-secondary)] uppercase">
            Voice companion
          </h3>
          <div className="min-h-[14rem]">
            <VapiControls book={book} variant="workspace" className="h-full" />
          </div>
        </section>

        <section className="space-y-3 border-t border-[var(--border-subtle)] pt-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[10px] font-semibold tracking-[0.16em] text-[var(--text-secondary)] uppercase">
              AI chat
            </h3>
            <Link
              href={chatHref}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--landing-maroon)] hover:underline"
            >
              <MessageSquare className="size-3" />
              Open page
            </Link>
          </div>
          <AIChatPanel
            bookId={book.id}
            currentPage={currentPage}
            onJumpToPage={onJumpToPage}
          />
        </section>
      </div>
    </aside>
  );
}
