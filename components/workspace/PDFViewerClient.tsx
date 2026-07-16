"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import { cn } from "@/lib/utils";
import type { ViewerFitMode, WorkspaceChapter } from "@/components/workspace/types";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Keep the worker on the same pdfjs version react-pdf ships (API === Worker).
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

type ScrollRequest = {
  page: number;
  nonce: number;
};

type PDFViewerClientProps = {
  fileUrl: string;
  title: string;
  zoom: number;
  fitMode: ViewerFitMode;
  currentPage: number;
  showThumbnails?: boolean;
  scrollRequest: ScrollRequest;
  onPageChange: (page: number) => void;
  onDocumentReady: (payload: {
    totalPages: number;
    chapters: WorkspaceChapter[];
  }) => void;
};

type OutlineNode = {
  title?: string;
  dest?: unknown;
  items?: OutlineNode[];
};

function buildFallbackChapters(totalPages: number): WorkspaceChapter[] {
  if (totalPages <= 0) return [];

  const size = totalPages <= 20 ? 5 : totalPages <= 100 ? 10 : 20;
  const chapters: WorkspaceChapter[] = [];

  for (let page = 1; page <= totalPages; page += size) {
    const endPage = Math.min(totalPages, page + size - 1);
    chapters.push({
      id: `pages-${page}`,
      title: `Pages ${page}-${endPage}`,
      page,
    });
  }

  return chapters;
}

export default function PDFViewerClient({
  fileUrl,
  title,
  zoom,
  fitMode,
  currentPage,
  showThumbnails = false,
  scrollRequest,
  onPageChange,
  onDocumentReady,
}: PDFViewerClientProps) {
  const [numPages, setNumPages] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const pageRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const visibilityRef = useRef<Map<number, number>>(new Map());

  const pageNumbers = useMemo(
    () => Array.from({ length: numPages }, (_, index) => index + 1),
    [numPages],
  );

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      const nextWidth = entries[0]?.contentRect.width ?? 0;
      setContainerWidth(nextWidth);
    });

    observer.observe(element);
    setContainerWidth(element.clientWidth);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = viewportRef.current;
    if (!root || numPages === 0) return;

    const thresholds = [0.1, 0.25, 0.5, 0.75, 0.95];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const page = Number(
            (entry.target as HTMLElement).dataset.pageNumber || "0",
          );
          if (!page) continue;
          visibilityRef.current.set(page, entry.intersectionRatio);
        }

        let bestPage = currentPage;
        let bestRatio = -1;

        visibilityRef.current.forEach((ratio, page) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestPage = page;
          }
        });

        if (bestPage !== currentPage && bestRatio > 0) {
          onPageChange(bestPage);
        }
      },
      {
        root,
        threshold: thresholds,
        rootMargin: "-20% 0px -45% 0px",
      },
    );

    pageNumbers.forEach((page) => {
      const node = pageRefs.current[page];
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [currentPage, numPages, onPageChange, pageNumbers]);

  useEffect(() => {
    if (!scrollRequest.page || !scrollRequest.nonce) return;
    const node = pageRefs.current[scrollRequest.page];
    if (!node) return;

    node.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [scrollRequest]);

  const pageWidth = useMemo(() => {
    if (!containerWidth) {
      return fitMode === "page" ? 620 : 720;
    }

    const viewportWidth = Math.max(280, containerWidth - 32);
    const baseWidth = fitMode === "page" ? viewportWidth * 0.82 : viewportWidth;
    return Math.floor(baseWidth * zoom);
  }, [containerWidth, fitMode, zoom]);

  const onLoadSuccess = async (pdf: {
    numPages: number;
    getOutline: () => Promise<OutlineNode[] | null>;
    getDestination: (dest: string) => Promise<unknown>;
    getPageIndex: (ref: unknown) => Promise<number>;
  }) => {
    setNumPages(pdf.numPages);
    setLoadError(null);

    const rawOutline = await pdf.getOutline();
    const chapters: WorkspaceChapter[] = [];
    let chapterCounter = 0;

    async function walk(items: OutlineNode[]) {
      for (const item of items) {
        let destination: unknown = item.dest;

        if (typeof destination === "string") {
          destination = await pdf.getDestination(destination);
        }

        const ref = Array.isArray(destination) ? destination[0] : null;
        if (ref) {
          try {
            const pageIndex = await pdf.getPageIndex(ref);
            chapterCounter += 1;
            chapters.push({
              id: `outline-${chapterCounter}-p${pageIndex + 1}`,
              title: item.title || `Page ${pageIndex + 1}`,
              page: pageIndex + 1,
            });
          } catch {
            // Ignore invalid outline destinations and keep walking.
          }
        }

        if (item.items?.length) {
          await walk(item.items);
        }
      }
    }

    if (rawOutline?.length) {
      await walk(rawOutline);
    }

    onDocumentReady({
      totalPages: pdf.numPages,
      chapters:
        chapters.length > 0 ? chapters : buildFallbackChapters(pdf.numPages),
    });
  };

  return (
    <div
      className={cn(
        "grid h-full min-h-[28rem] gap-4",
        showThumbnails && numPages > 0
          ? "xl:grid-cols-[5.75rem_minmax(0,1fr)]"
          : "grid-cols-1",
      )}
    >
      {showThumbnails && numPages > 0 ? (
        <div className="hidden min-h-0 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-card/70 p-2 xl:block">
          <div className="h-full overflow-y-auto [scrollbar-width:thin]">
            <div className="space-y-2">
              {pageNumbers.map((pageNumber) => (
                <button
                  key={`thumb-${pageNumber}`}
                  type="button"
                  onClick={() => {
                    const node = pageRefs.current[pageNumber];
                    node?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={cn(
                    "w-full rounded-xl border p-1.5 text-left transition-colors",
                    currentPage === pageNumber
                      ? "border-[var(--landing-maroon)] bg-[var(--landing-maroon-soft)]"
                      : "border-transparent bg-[var(--landing-parchment-deep)] hover:bg-[var(--landing-maroon-soft)]",
                  )}
                >
                  <Document file={fileUrl} loading={null}>
                    <Page
                      pageNumber={pageNumber}
                      width={64}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      loading={
                        <div className="h-20 animate-pulse rounded-md bg-card" />
                      }
                    />
                  </Document>
                  <div className="mt-1.5 text-center text-[10px] font-medium text-[var(--landing-ink)]">
                    {pageNumber}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="min-h-0 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--landing-parchment-deep)]/60">
        <Document
          file={fileUrl}
          onLoadSuccess={onLoadSuccess}
          onLoadError={(error) => {
            console.error(error);
            const message =
              error instanceof Error ? error.message : String(error ?? "");
            setLoadError(
              message.includes("Worker") || message.includes("API version")
                ? "PDF worker version mismatch. Refresh the page after restarting the app."
                : "This PDF could not be loaded in the workspace.",
            );
          }}
          loading={
            <div className="flex h-full min-h-[28rem] items-center justify-center text-sm text-[var(--text-secondary)]">
              Preparing {title}…
            </div>
          }
          className="h-full"
        >
          <div
            ref={viewportRef}
            className="h-full overflow-y-auto [scrollbar-width:thin]"
          >
            {loadError ? (
              <div className="flex min-h-[28rem] items-center justify-center px-6 text-center text-sm text-destructive">
                {loadError}
              </div>
            ) : (
              <div className="space-y-6 px-4 py-5 sm:px-8 sm:py-6">
                {pageNumbers.map((pageNumber) => (
                  <div
                    key={`page-${pageNumber}`}
                    ref={(node) => {
                      pageRefs.current[pageNumber] = node;
                    }}
                    data-page-number={pageNumber}
                    className="flex justify-center"
                  >
                    <div className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-white shadow-sm">
                      <Page
                        pageNumber={pageNumber}
                        width={pageWidth}
                        renderTextLayer
                        renderAnnotationLayer
                        loading={
                          <div
                            className="animate-pulse bg-[var(--landing-parchment-deep)]"
                            style={{
                              width: pageWidth,
                              height: Math.floor(pageWidth * 1.35),
                            }}
                          />
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Document>
      </div>
    </div>
  );
}
