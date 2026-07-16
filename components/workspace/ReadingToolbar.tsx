"use client";

import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Images,
  Minus,
  Plus,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ViewerFitMode } from "@/components/workspace/types";

type ReadingToolbarProps = {
  currentPage: number;
  totalPages: number;
  zoom: number;
  fitMode: ViewerFitMode;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
  onJumpToPage: (page: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onSetFitMode: (mode: ViewerFitMode) => void;
  onToggleFullscreen: () => void;
  thumbnailsOpen: boolean;
  onToggleThumbnails: () => void;
};

export default function ReadingToolbar({
  currentPage,
  totalPages,
  zoom,
  fitMode,
  canGoPrev,
  canGoNext,
  onPrevPage,
  onNextPage,
  onJumpToPage,
  onZoomIn,
  onZoomOut,
  onSetFitMode,
  onToggleFullscreen,
  thumbnailsOpen,
  onToggleThumbnails,
}: ReadingToolbarProps) {
  const [pageInput, setPageInput] = useState(String(currentPage));

  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  const submitPage = () => {
    const parsed = Number.parseInt(pageInput, 10);
    if (!Number.isFinite(parsed)) {
      setPageInput(String(currentPage));
      return;
    }

    onJumpToPage(parsed);
  };

  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-card px-3 py-2.5 text-card-foreground shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="rounded-full"
            onClick={onPrevPage}
            disabled={!canGoPrev}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <div className="flex h-9 items-center gap-1.5 rounded-full bg-[var(--landing-parchment-deep)] px-3">
            <Input
              value={pageInput}
              onChange={(event) => setPageInput(event.target.value)}
              onBlur={submitPage}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  submitPage();
                }
              }}
              className="h-7 w-11 border-0 bg-transparent px-0 text-center text-sm shadow-none focus-visible:ring-0"
              inputMode="numeric"
              aria-label="Jump to page"
            />
            <span className="text-xs text-[var(--text-secondary)]">
              / {totalPages || "—"}
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="rounded-full"
            onClick={onNextPage}
            disabled={!canGoNext}
            aria-label="Next page"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>

        <div className="mx-1 hidden h-5 w-px bg-[var(--border-subtle)] sm:block" />

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="rounded-full"
            onClick={onZoomOut}
            aria-label="Zoom out"
          >
            <Minus className="size-4" />
          </Button>
          <span className="min-w-12 text-center text-sm font-medium text-[var(--landing-ink)]">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="rounded-full"
            onClick={onZoomIn}
            aria-label="Zoom in"
          >
            <Plus className="size-4" />
          </Button>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={cn(
              "rounded-full",
              thumbnailsOpen &&
                "bg-[var(--landing-maroon-soft)] text-[var(--landing-maroon)]",
            )}
            onClick={onToggleThumbnails}
            aria-label={thumbnailsOpen ? "Hide thumbnails" : "Show thumbnails"}
            title="Thumbnails"
          >
            <Images className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              "h-9 rounded-full px-3 text-xs",
              fitMode === "width" &&
                "bg-[var(--landing-maroon-soft)] text-[var(--landing-maroon)]",
            )}
            onClick={() => onSetFitMode("width")}
          >
            Fit width
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              "h-9 rounded-full px-3 text-xs",
              fitMode === "page" &&
                "bg-[var(--landing-maroon-soft)] text-[var(--landing-maroon)]",
            )}
            onClick={() => onSetFitMode("page")}
          >
            Fit page
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="rounded-full"
            onClick={onToggleFullscreen}
            aria-label="Fullscreen"
          >
            <Expand className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
