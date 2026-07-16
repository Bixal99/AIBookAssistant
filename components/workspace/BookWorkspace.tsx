"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import AssistantPanel from "@/components/workspace/AssistantPanel";
import PDFViewer from "@/components/workspace/PDFViewer";
import ReaderPanel from "@/components/workspace/ReaderPanel";
import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";
import WorkspaceSidebar from "@/components/workspace/WorkspaceSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  endReadingSession,
  startReadingSession,
  updateReadingProgress,
} from "@/lib/actions/reading.actions";
import type {
  ViewerFitMode,
  WorkspaceBook,
  WorkspaceChapter,
} from "@/components/workspace/types";

type BookWorkspaceProps = {
  book: WorkspaceBook;
};

type ScrollRequest = {
  page: number;
  nonce: number;
};

type WorkspacePrefs = {
  zoom: number;
  fitMode: ViewerFitMode;
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  thumbnailsOpen: boolean;
};

const DEFAULT_PREFS: WorkspacePrefs = {
  zoom: 1,
  fitMode: "width",
  leftPanelOpen: true,
  rightPanelOpen: false,
  thumbnailsOpen: false,
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

function loadWorkspacePrefs(prefsKey: string): WorkspacePrefs {
  if (typeof window === "undefined") {
    return DEFAULT_PREFS;
  }

  try {
    const raw = window.localStorage.getItem(prefsKey);
    if (!raw) return DEFAULT_PREFS;

    const parsed = JSON.parse(raw) as Partial<WorkspacePrefs>;
    return {
      zoom: clamp(parsed.zoom ?? DEFAULT_PREFS.zoom, 0.7, 2),
      fitMode: parsed.fitMode ?? DEFAULT_PREFS.fitMode,
      leftPanelOpen: parsed.leftPanelOpen ?? DEFAULT_PREFS.leftPanelOpen,
      rightPanelOpen: parsed.rightPanelOpen ?? DEFAULT_PREFS.rightPanelOpen,
      thumbnailsOpen: parsed.thumbnailsOpen ?? DEFAULT_PREFS.thumbnailsOpen,
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

export default function BookWorkspace({ book }: BookWorkspaceProps) {
  const prefsKey = `book-workspace:v2:${book.id}:prefs`;
  const initialPrefs = loadWorkspacePrefs(prefsKey);

  const [currentPage, setCurrentPage] = useState(
    book.readingProgress.currentPage || 1,
  );
  const [totalPages, setTotalPages] = useState(
    book.readingProgress.totalPages || 0,
  );
  const [chapters, setChapters] = useState<WorkspaceChapter[]>([]);
  const [zoom, setZoom] = useState(initialPrefs.zoom);
  const [fitMode, setFitMode] = useState<ViewerFitMode>(initialPrefs.fitMode);
  const [leftPanelOpen, setLeftPanelOpen] = useState(initialPrefs.leftPanelOpen);
  const [rightPanelOpen, setRightPanelOpen] = useState(
    initialPrefs.rightPanelOpen,
  );
  const [thumbnailsOpen, setThumbnailsOpen] = useState(
    initialPrefs.thumbnailsOpen,
  );
  const [scrollRequest, setScrollRequest] = useState<ScrollRequest>({
    page: book.readingProgress.currentPage || 1,
    nonce: 1,
  });
  const [readingSeconds, setReadingSeconds] = useState(0);
  const [activeMobileTab, setActiveMobileTab] = useState("reader");

  const readerShellRef = useRef<HTMLDivElement | null>(null);
  const readingSessionIdRef = useRef<string | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const latestPageRef = useRef(currentPage);
  const latestTotalPagesRef = useRef(totalPages);
  const readingSecondsRef = useRef(readingSeconds);

  const percentage = useMemo(() => {
    if (!totalPages) return book.readingProgress.percentage || 0;
    return (currentPage / totalPages) * 100;
  }, [book.readingProgress.percentage, currentPage, totalPages]);

  useEffect(() => {
    latestPageRef.current = currentPage;
    latestTotalPagesRef.current = totalPages;
    readingSecondsRef.current = readingSeconds;
  }, [currentPage, totalPages, readingSeconds]);

  useEffect(() => {
    const prefs: WorkspacePrefs = {
      zoom,
      fitMode,
      leftPanelOpen,
      rightPanelOpen,
      thumbnailsOpen,
    };

    window.localStorage.setItem(prefsKey, JSON.stringify(prefs));
  }, [fitMode, leftPanelOpen, prefsKey, rightPanelOpen, thumbnailsOpen, zoom]);

  useEffect(() => {
    let isMounted = true;
    let interval: ReturnType<typeof setInterval> | null = null;

    startReadingSession(book.id).then((result) => {
      if (!isMounted || !result.success || !result.sessionId) return;

      readingSessionIdRef.current = result.sessionId;
      startedAtRef.current = Date.now();
      interval = setInterval(() => {
        if (!startedAtRef.current) return;
        setReadingSeconds(
          Math.floor((Date.now() - startedAtRef.current) / 1000),
        );
      }, 1000);
    });

    return () => {
      isMounted = false;
      if (interval) clearInterval(interval);
      if (readingSessionIdRef.current) {
        void endReadingSession(
          readingSessionIdRef.current,
          readingSecondsRef.current,
        );
      }
    };
  }, [book.id]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void updateReadingProgress({
        bookId: book.id,
        currentPage,
        totalPages,
      });
    }, 800);

    return () => window.clearTimeout(timeout);
  }, [book.id, currentPage, totalPages]);

  useEffect(() => {
    const flushProgress = () => {
      void updateReadingProgress({
        bookId: book.id,
        currentPage: latestPageRef.current,
        totalPages: latestTotalPagesRef.current,
      });
    };

    const handlePageHide = () => {
      flushProgress();
      if (readingSessionIdRef.current) {
        void endReadingSession(
          readingSessionIdRef.current,
          readingSecondsRef.current,
        );
      }
    };

    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("beforeunload", handlePageHide);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("beforeunload", handlePageHide);
    };
  }, [book.id]);

  const jumpToPage = useCallback(
    (page: number) => {
      const safePage =
        totalPages > 0 ? clamp(page, 1, totalPages) : Math.max(1, page);
      setCurrentPage(safePage);
      setScrollRequest({ page: safePage, nonce: Date.now() });
    },
    [totalPages],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLElement &&
        ["INPUT", "TEXTAREA"].includes(event.target.tagName)
      ) {
        return;
      }

      if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault();
        jumpToPage(currentPage + 1);
      } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        jumpToPage(currentPage - 1);
      } else if (event.key === "+") {
        event.preventDefault();
        setZoom((value) => clamp(value + 0.1, 0.7, 2));
      } else if (event.key === "-") {
        event.preventDefault();
        setZoom((value) => clamp(value - 0.1, 0.7, 2));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentPage, jumpToPage]);

  const toggleFullscreen = async () => {
    const element = readerShellRef.current;
    if (!element) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await element.requestFullscreen();
    }
  };

  const reader = (
    <ReaderPanel
      toolbar={{
        currentPage,
        totalPages,
        zoom,
        fitMode,
        canGoPrev: currentPage > 1,
        canGoNext: totalPages === 0 || currentPage < totalPages,
        onPrevPage: () => jumpToPage(currentPage - 1),
        onNextPage: () => jumpToPage(currentPage + 1),
        onJumpToPage: jumpToPage,
        onZoomIn: () => setZoom((value) => clamp(value + 0.1, 0.7, 2)),
        onZoomOut: () => setZoom((value) => clamp(value - 0.1, 0.7, 2)),
        onSetFitMode: setFitMode,
        onToggleFullscreen: toggleFullscreen,
        thumbnailsOpen,
        onToggleThumbnails: () => setThumbnailsOpen((value) => !value),
      }}
      viewer={
        <PDFViewer
          fileUrl={book.fileURL}
          title={book.title}
          zoom={zoom}
          fitMode={fitMode}
          currentPage={currentPage}
          showThumbnails={thumbnailsOpen}
          scrollRequest={scrollRequest}
          onPageChange={setCurrentPage}
          onDocumentReady={({
            totalPages: nextTotalPages,
            chapters: nextChapters,
          }) => {
            setTotalPages(nextTotalPages);
            setChapters(nextChapters);
            setCurrentPage((page) => {
              const nextPage = clamp(page, 1, Math.max(1, nextTotalPages));
              setScrollRequest({ page: nextPage, nonce: Date.now() });
              return nextPage;
            });
          }}
        />
      }
    />
  );

  const leftPanel = leftPanelOpen ? (
    <WorkspaceSidebar
      book={book}
      chapters={chapters}
      currentPage={currentPage}
      totalPages={totalPages}
      readingSeconds={readingSeconds}
      onJumpToPage={jumpToPage}
      className="h-full"
    />
  ) : null;

  const rightPanel = rightPanelOpen ? (
    <AssistantPanel
      book={book}
      currentPage={currentPage}
      totalPages={totalPages}
      percentage={percentage}
      readingSeconds={readingSeconds}
    />
  ) : null;

  const desktopColumns = [
    leftPanelOpen ? "15rem" : null,
    "minmax(0,1fr)",
    rightPanelOpen ? "19rem" : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="-mx-4 -mt-1 space-y-4 sm:-mx-6 lg:-mx-8">
      <div className="px-4 sm:px-6 lg:px-8">
        <WorkspaceHeader
          book={book}
          currentPage={currentPage}
          totalPages={totalPages}
          percentage={percentage}
          leftPanelOpen={leftPanelOpen}
          rightPanelOpen={rightPanelOpen}
          onToggleLeftPanel={() => setLeftPanelOpen((value) => !value)}
          onToggleRightPanel={() => setRightPanelOpen((value) => !value)}
        />
      </div>

      <div
        ref={readerShellRef}
        className="hidden px-4 sm:px-6 lg:block lg:px-8"
      >
        <div
          className="grid h-[calc(100dvh-12rem)] gap-5"
          style={{ gridTemplateColumns: desktopColumns }}
        >
          {leftPanel}
          <div className="min-h-0 min-w-0">{reader}</div>
          {rightPanel}
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:hidden">
        <Tabs
          value={activeMobileTab}
          onValueChange={setActiveMobileTab}
          className="space-y-3"
        >
          <TabsList className="grid w-full grid-cols-3 rounded-2xl">
            <TabsTrigger value="reader">Reader</TabsTrigger>
            <TabsTrigger value="book">Book</TabsTrigger>
            <TabsTrigger value="assistant">AI</TabsTrigger>
          </TabsList>
          <TabsContent value="reader" className="min-h-[70dvh]">
            {reader}
          </TabsContent>
          <TabsContent value="book" className="min-h-[70dvh]">
            {leftPanel ?? (
              <div className="rounded-2xl border border-dashed border-[var(--border-subtle)] p-6 text-sm text-[var(--text-secondary)]">
                Navigation is hidden. Use the header toggle on larger screens.
              </div>
            )}
          </TabsContent>
          <TabsContent value="assistant" className="min-h-[70dvh]">
            {rightPanel ?? (
              <div className="rounded-2xl border border-dashed border-[var(--border-subtle)] p-6 text-sm text-[var(--text-secondary)]">
                Assistant is hidden. Use the header toggle on larger screens.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
