"use client";

import Link from "next/link";
import { ChevronLeft, PanelLeft, PanelRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { WorkspaceBook } from "@/components/workspace/types";

type WorkspaceHeaderProps = {
  book: WorkspaceBook;
  currentPage: number;
  totalPages: number;
  percentage: number;
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  onToggleLeftPanel: () => void;
  onToggleRightPanel: () => void;
};

export default function WorkspaceHeader({
  book,
  currentPage,
  totalPages,
  percentage,
  leftPanelOpen,
  rightPanelOpen,
  onToggleLeftPanel,
  onToggleRightPanel,
}: WorkspaceHeaderProps) {
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-card px-3 py-2.5 text-card-foreground shadow-sm sm:px-4">
      <div className="flex items-center gap-3">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="shrink-0 rounded-full px-2"
        >
          <Link href="/library">
            <ChevronLeft className="size-4" />
            <span className="hidden sm:inline">Library</span>
          </Link>
        </Button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate font-serif text-lg font-semibold text-[var(--landing-ink)] sm:text-xl">
              {book.title}
            </h1>
            <span className="hidden shrink-0 rounded-full bg-[var(--landing-maroon-soft)] px-2 py-0.5 text-[10px] font-medium tracking-wide text-[var(--landing-maroon)] uppercase sm:inline">
              Workspace
            </span>
          </div>
          <p className="truncate text-xs text-[var(--text-secondary)] sm:text-sm">
            {book.author}
            <span className="mx-1.5 text-[var(--border-medium)]">·</span>
            Page {currentPage}
            {totalPages > 0 ? ` / ${totalPages}` : ""}
            <span className="mx-1.5 text-[var(--border-medium)]">·</span>
            {percentage.toFixed(0)}%
          </p>
        </div>

        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-full px-2.5"
            onClick={onToggleLeftPanel}
            aria-label={leftPanelOpen ? "Hide navigation" : "Show navigation"}
          >
            <PanelLeft className="size-4" />
            <span className="text-xs">{leftPanelOpen ? "Hide chapters" : "Chapters"}</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-full px-2.5"
            onClick={onToggleRightPanel}
            aria-label={rightPanelOpen ? "Hide assistant" : "Show assistant"}
          >
            <PanelRight className="size-4" />
            <span className="text-xs">{rightPanelOpen ? "Hide assistant" : "Assistant"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
