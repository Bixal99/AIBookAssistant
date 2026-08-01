"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, ChevronLeft } from "lucide-react";

import BookCover from "@/components/BookCover";
import VapiControls from "@/components/VapiControls";
import AIChatPanel from "@/components/workspace/AIChatPanel";
import { Button } from "@/components/ui/button";
import type { WorkspaceBook } from "@/components/workspace/types";

type BookAssistantPageProps = {
  book: WorkspaceBook;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function BookAssistantPage({ book }: BookAssistantPageProps) {
  const router = useRouter();
  const currentPage = book.readingProgress.currentPage || 1;
  const totalPages = book.readingProgress.totalPages || 0;
  const percentage = book.readingProgress.percentage || 0;
  const categories = book.categories?.map((entry) => entry.category.name) ?? [];
  const readerHref = `/books/${book.slug}`;

  const jumpToReaderPage = (page: number) => {
    router.push(`${readerHref}?page=${page}`);
  };

  return (
    <div className="-mx-4 -mt-1 space-y-4 sm:-mx-6 lg:-mx-8">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-card px-3 py-2.5 text-card-foreground shadow-sm sm:px-4">
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="shrink-0 rounded-full px-2"
            >
              <Link href={readerHref}>
                <ChevronLeft className="size-4" />
                <span className="hidden sm:inline">Back to reader</span>
                <span className="sm:hidden">Reader</span>
              </Link>
            </Button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="truncate font-serif text-lg font-semibold text-[var(--landing-ink)] sm:text-xl">
                  Assistant
                </h1>
                <span className="hidden shrink-0 rounded-full bg-[var(--landing-maroon-soft)] px-2 py-0.5 text-[10px] font-medium tracking-wide text-[var(--landing-maroon)] uppercase sm:inline">
                  Chat
                </span>
              </div>
              <p className="truncate text-xs text-[var(--text-secondary)] sm:text-sm">
                {book.title}
                <span className="mx-1.5 text-[var(--border-medium)]">·</span>
                {book.author}
              </p>
            </div>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="shrink-0 rounded-full"
            >
              <Link href={readerHref}>
                <BookOpen className="size-4" />
                <span className="hidden sm:inline">Open book</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
          <section className="flex min-h-[calc(100dvh-14rem)] flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-card p-4 shadow-sm sm:p-5">
            <div className="mb-4 shrink-0">
              <h2 className="font-serif text-xl font-semibold text-[var(--landing-ink)]">
                AI chat
              </h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Ask about this book. Conversations stay saved when you return to
                the reader.
              </p>
            </div>
            <div className="min-h-0 flex-1">
              <AIChatPanel
                bookId={book.id}
                currentPage={currentPage}
                onJumpToPage={jumpToReaderPage}
                className="h-full min-h-[28rem]"
              />
            </div>
          </section>

          <aside className="space-y-4 lg:sticky lg:top-4">
            <section className="rounded-2xl border border-[var(--border-subtle)] bg-card p-4 shadow-sm">
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
                    {percentage.toFixed(0)}% · {formatBytes(book.fileSize)}
                  </p>
                </div>
              </div>
              {categories.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {categories.map((category) => (
                    <span
                      key={category}
                      className="rounded-full bg-[var(--landing-parchment-deep)] px-2.5 py-1 text-[11px] font-medium text-[var(--landing-maroon)]"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              ) : null}
            </section>

            <section className="rounded-2xl border border-[var(--border-subtle)] bg-card p-4 shadow-sm">
              <h3 className="text-[10px] font-semibold tracking-[0.16em] text-[var(--text-secondary)] uppercase">
                Voice companion
              </h3>
              <div className="mt-3 min-h-[14rem]">
                <VapiControls
                  book={book}
                  variant="workspace"
                  className="h-full"
                />
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
