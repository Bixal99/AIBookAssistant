"use client";

import ReadingToolbar from "@/components/workspace/ReadingToolbar";

type ReaderPanelProps = {
  toolbar: {
    currentPage: number;
    totalPages: number;
    zoom: number;
    fitMode: "width" | "page";
    canGoPrev: boolean;
    canGoNext: boolean;
    onPrevPage: () => void;
    onNextPage: () => void;
    onJumpToPage: (page: number) => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onSetFitMode: (mode: "width" | "page") => void;
    onToggleFullscreen: () => void;
    thumbnailsOpen: boolean;
    onToggleThumbnails: () => void;
  };
  viewer: React.ReactNode;
};

export default function ReaderPanel({ toolbar, viewer }: ReaderPanelProps) {
  return (
    <section className="flex h-full min-h-0 flex-col gap-3">
      <ReadingToolbar {...toolbar} />
      <div className="min-h-0 flex-1 overflow-hidden">{viewer}</div>
    </section>
  );
}
