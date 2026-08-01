"use client";

import { Copy, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";

import CitationList from "@/components/workspace/CitationList";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ChatCitation } from "@/types";

type ChatMessageBubbleProps = {
  role: "user" | "assistant" | "system";
  content: string;
  citations?: ChatCitation[] | null;
  isStreaming?: boolean;
  showRegenerate?: boolean;
  onRegenerate?: () => void;
  onJumpToPage?: (page: number) => void;
};

export default function ChatMessageBubble({
  role,
  content,
  citations,
  isStreaming,
  showRegenerate,
  onRegenerate,
  onJumpToPage,
}: ChatMessageBubbleProps) {
  const isUser = role === "user";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Copied");
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <div
      className={cn(
        "rounded-2xl px-3 py-2.5 text-sm",
        isUser
          ? "ml-4 bg-[var(--landing-maroon)] text-white"
          : "mr-2 border border-[var(--border-subtle)] bg-[var(--landing-parchment-deep)] text-[var(--landing-ink)]",
      )}
    >
      {isUser ? (
        <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
      ) : (
        <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-2 prose-headings:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-pre:bg-card prose-code:text-[var(--landing-maroon)]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content || (isStreaming ? "…" : "")}
          </ReactMarkdown>
        </div>
      )}

      {!isUser && citations && citations.length > 0 ? (
        <CitationList
          citations={citations}
          onJumpToPage={onJumpToPage}
          className="mt-3 border-t border-[var(--border-subtle)] pt-2"
        />
      ) : null}

      {!isUser && content && !isStreaming ? (
        <div className="mt-2 flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="xs"
            className="h-7 rounded-full px-2 text-[11px]"
            onClick={copy}
          >
            <Copy className="size-3" />
            Copy
          </Button>
          {showRegenerate && onRegenerate ? (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              className="h-7 rounded-full px-2 text-[11px]"
              onClick={onRegenerate}
            >
              <RefreshCw className="size-3" />
              Regenerate
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
