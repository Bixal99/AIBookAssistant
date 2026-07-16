"use client";

import { BookMarked, Highlighter, ListTree, NotebookTabs } from "lucide-react";

import { cn, formatDurationLabel } from "@/lib/utils";
import type { WorkspaceBook, WorkspaceChapter } from "@/components/workspace/types";

type WorkspaceSidebarProps = {
  book: WorkspaceBook;
  chapters: WorkspaceChapter[];
  currentPage: number;
  totalPages: number;
  readingSeconds: number;
  onJumpToPage: (page: number) => void;
  className?: string;
};

function PlaceholderItem({
  icon: Icon,
  label,
}: {
  icon: typeof BookMarked;
  label: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-dashed border-[var(--border-subtle)] px-3 py-2.5 text-xs text-[var(--text-secondary)]">
      <span className="inline-flex items-center gap-2">
        <Icon className="size-3.5 text-[var(--landing-maroon)]" />
        {label}
      </span>
      <span className="text-[10px] uppercase tracking-wide opacity-60">Soon</span>
    </div>
  );
}

export default function WorkspaceSidebar({
  book,
  chapters,
  currentPage,
  totalPages,
  readingSeconds,
  onJumpToPage,
  className,
}: WorkspaceSidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-card text-card-foreground shadow-sm",
        className,
      )}
    >
      <div className="shrink-0 border-b border-[var(--border-subtle)] px-4 py-3.5">
        <h2 className="font-serif text-lg font-semibold text-[var(--landing-ink)]">
          Chapters
        </h2>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          {totalPages > 0
            ? `Page ${currentPage} of ${totalPages} · ${formatDurationLabel(readingSeconds)}`
            : "Loading pages…"}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4 [scrollbar-width:thin]">
        <div className="space-y-5">
          <section className="space-y-2.5">
            <div className="flex items-center gap-2">
              <ListTree className="size-3.5 text-[var(--landing-maroon)]" />
              <h3 className="text-[10px] font-semibold tracking-[0.16em] text-[var(--text-secondary)] uppercase">
                Contents
              </h3>
            </div>
            <div className="space-y-1.5">
              {chapters.length === 0 ? (
                <p className="px-1 py-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                  Chapters appear once the PDF loads.
                </p>
              ) : (
                chapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    type="button"
                    onClick={() => onJumpToPage(chapter.page)}
                    className={cn(
                      "w-full rounded-xl border px-3 py-2.5 text-left text-sm transition-colors",
                      currentPage === chapter.page
                        ? "border-[var(--landing-maroon)] bg-[var(--landing-maroon-soft)] text-[var(--landing-maroon)]"
                        : "border-transparent text-[var(--landing-ink)] hover:bg-[var(--landing-parchment-deep)]",
                    )}
                  >
                    <div className="leading-snug font-medium">{chapter.title}</div>
                    <div className="mt-1 text-[11px] opacity-65">
                      Page {chapter.page}
                    </div>
                  </button>
                ))
              )}
            </div>
          </section>

          <section className="space-y-2 border-t border-[var(--border-subtle)] pt-4">
            <p className="px-1 text-[10px] font-semibold tracking-[0.16em] text-[var(--text-secondary)] uppercase">
              Coming later
            </p>
            <div className="space-y-2">
              <PlaceholderItem icon={BookMarked} label="Bookmarks" />
              <PlaceholderItem icon={NotebookTabs} label="Notes" />
              <PlaceholderItem icon={Highlighter} label="Highlights" />
            </div>
            <p className="px-1 pt-1 text-[11px] leading-relaxed text-[var(--text-secondary)]">
              {book.totalSegments} segments indexed for AI search.
            </p>
          </section>
        </div>
      </div>
    </aside>
  );
}
