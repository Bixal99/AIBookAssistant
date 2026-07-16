'use client';

import { Check, Mic, MicOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import useVapi from "@/hooks/useVapi";
import { IBook } from "@/types";
import BookCover from "@/components/BookCover";
import Transcript from "@/components/Transcript";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/auth-constants";

const VapiControls = ({ book }: { book: IBook }) => {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const {
    status,
    isActive,
    messages,
    currentMessage,
    currentUserMessage,
    duration,
    start,
    stop,
    clearError,
    limitError,
    maxDurationSeconds,
  } = useVapi(book);

  useEffect(() => {
    if (limitError) {
      toast.error(limitError);
      clearError();
    }
  }, [limitError, clearError]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusDisplay = () => {
    switch (status) {
      case "connecting":
        return { label: "Connecting...", color: "vapi-status-dot-connecting" };
      case "starting":
        return { label: "Starting...", color: "vapi-status-dot-starting" };
      case "listening":
        return { label: "Listening", color: "vapi-status-dot-listening" };
      case "thinking":
        return { label: "Thinking...", color: "vapi-status-dot-thinking" };
      case "speaking":
        return { label: "Speaking", color: "vapi-status-dot-speaking" };
      default:
        return { label: "Ready", color: "vapi-status-dot-ready" };
    }
  };

  const statusDisplay = getStatusDisplay();

  const handleDone = () => {
    setSaving(true);
    try {
      if (isActive) {
        stop();
      }
      toast.success("Progress saved");
      router.push(ROUTES.library);
      router.refresh();
    } catch {
      toast.error("Could not save session. Try again.");
      setSaving(false);
    }
  };

  return (
    <div className="book-session-layout">
      {/* Compact header */}
      <div className="vapi-header-card shrink-0 !gap-4 !p-4 sm:!p-5">
        <div className="vapi-cover-wrapper">
          <BookCover
            src={book.coverURL}
            title={book.title}
            width={88}
            height={132}
            className="vapi-cover-image !h-[132px] !w-[88px] sm:!h-[148px] sm:!w-[98px]"
            priority
          />
          <div className="vapi-mic-wrapper relative">
            {isActive &&
              (status === "speaking" || status === "thinking") && (
                <div className="absolute inset-0 animate-ping rounded-full bg-card opacity-75" />
              )}
            <button
              type="button"
              onClick={isActive ? stop : start}
              disabled={status === "connecting" || saving}
              className={`vapi-mic-btn shadow-md !h-12 !w-12 sm:!h-14 sm:!w-14 z-10 ${
                isActive ? "vapi-mic-btn-active" : "vapi-mic-btn-inactive"
              }`}
              aria-label={isActive ? "Stop conversation" : "Start conversation"}
            >
              {isActive ? (
                <Mic className="size-5 text-white sm:size-6" />
              ) : (
                <MicOff className="size-5 text-[var(--landing-ink)] sm:size-6" />
              )}
            </button>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2.5">
          <div>
            <h1 className="mb-0.5 truncate font-serif text-xl font-bold text-[var(--landing-ink)] sm:text-2xl">
              {book.title}
            </h1>
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              by {book.author}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="vapi-status-indicator !px-2.5 !py-1.5">
              <span className={`vapi-status-dot ${statusDisplay.color}`} />
              <span className="vapi-status-text !text-xs sm:!text-sm">
                {statusDisplay.label}
              </span>
            </div>
            <div className="vapi-status-indicator !px-2.5 !py-1.5">
              <span className="vapi-status-text !text-xs sm:!text-sm">
                Voice: {book.persona || "Daniel"}
              </span>
            </div>
            <div className="vapi-status-indicator !px-2.5 !py-1.5">
              <span className="vapi-status-text !text-xs sm:!text-sm">
                {formatDuration(duration)}/
                {formatDuration(maxDurationSeconds)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Conversation fills remaining height */}
      <div className="vapi-transcript-wrapper min-h-0 flex-1">
        <div className="transcript-container h-full min-h-0">
          <Transcript
            messages={messages}
            currentMessage={currentMessage}
            currentUserMessage={currentUserMessage}
          />
        </div>
      </div>

      {/* Actions at the end — outside the boxes */}
      <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 pt-1">
        <Button
          type="button"
          variant="secondary"
          className="rounded-full"
          onClick={() => router.push(ROUTES.dashboard)}
          disabled={saving || isActive}
        >
          Dashboard
        </Button>
        <Button
          type="button"
          className="rounded-full"
          onClick={handleDone}
          disabled={saving}
        >
          <Check className="size-4" />
          {saving ? "Saving…" : "Done"}
        </Button>
      </div>
    </div>
  );
};

export default VapiControls;
