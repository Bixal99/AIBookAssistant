"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { LoaderCircle, Plus, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";

import ChatMessageBubble from "@/components/workspace/ChatMessageBubble";
import SuggestedActions from "@/components/workspace/SuggestedActions";
import { Button } from "@/components/ui/button";
import {
  createChatSession,
  deleteChatSession,
  getLatestChatForBook,
  listChatSessions,
} from "@/lib/actions/chat.actions";
import { cn } from "@/lib/utils";
import type { ChatCitation, IChatMessage, IChatSession } from "@/types";

type UIMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: ChatCitation[] | null;
  streaming?: boolean;
};

type AIChatPanelProps = {
  bookId: string;
  currentPage: number;
  onJumpToPage?: (page: number) => void;
  className?: string;
};

function mapServerMessages(messages: IChatMessage[]): UIMessage[] {
  return messages
    .filter((message) => message.role === "user" || message.role === "assistant")
    .map((message) => ({
      id: message.id,
      role: message.role as "user" | "assistant",
      content: message.content,
      citations: message.citations ?? null,
    }));
}

export default function AIChatPanel({
  bookId,
  currentPage,
  onJumpToPage,
  className,
}: AIChatPanelProps) {
  const [sessions, setSessions] = useState<IChatSession[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      const [latest, sessionList] = await Promise.all([
        getLatestChatForBook(bookId),
        listChatSessions(bookId),
      ]);

      if (cancelled) return;

      if (sessionList.success && sessionList.data) {
        setSessions(sessionList.data as IChatSession[]);
      }

      if (latest.success && latest.data) {
        const data = latest.data as IChatSession & { messages: IChatMessage[] };
        setSessionId(data.id);
        setMessages(mapServerMessages(data.messages || []));
      }

      setLoading(false);
    })();

    return () => {
      cancelled = true;
      abortRef.current?.abort();
    };
  }, [bookId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const refreshSessions = () => {
    startTransition(async () => {
      const result = await listChatSessions(bookId);
      if (result.success && result.data) {
        setSessions(result.data as IChatSession[]);
      }
    });
  };

  const sendMessage = async (raw: string, options?: { regenerate?: boolean }) => {
    const text = raw.trim();
    if (!text || busy) return;

    setBusy(true);
    setInput("");

    const regenerate = Boolean(options?.regenerate);
    let activeSessionId = sessionId;

    if (!activeSessionId) {
      const created = await createChatSession(bookId, text);
      if (!created.success || !created.data) {
        toast.error(
          typeof created.error === "string"
            ? created.error
            : "Could not start chat.",
        );
        setBusy(false);
        return;
      }
      activeSessionId = (created.data as IChatSession).id;
      setSessionId(activeSessionId);
      refreshSessions();
    }

    if (!regenerate) {
      setMessages((prev) => [
        ...prev,
        {
          id: `local-user-${Date.now()}`,
          role: "user",
          content: text,
        },
      ]);
    } else {
      setMessages((prev) => {
        const next = [...prev];
        if (next[next.length - 1]?.role === "assistant") {
          next.pop();
        }
        return next;
      });
    }

    const assistantId = `local-assistant-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: assistantId,
        role: "assistant",
        content: "",
        streaming: true,
        citations: null,
      },
    ]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/books/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          bookId,
          sessionId: activeSessionId,
          message: text,
          currentPage,
          regenerate,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(payload?.error || "Chat request failed.");
      }

      const nextSessionId = response.headers.get("X-Chat-Session-Id");
      if (nextSessionId) {
        setSessionId(nextSessionId);
      }

      let citations: ChatCitation[] = [];
      const citationsHeader = response.headers.get("X-Chat-Citations");
      if (citationsHeader) {
        try {
          citations = JSON.parse(decodeURIComponent(citationsHeader)) as ChatCitation[];
        } catch {
          citations = [];
        }
      }

      if (!response.body) {
        throw new Error("No response stream.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        const snapshot = accumulated;
        setMessages((prev) =>
          prev.map((message) =>
            message.id === assistantId
              ? {
                  ...message,
                  content: snapshot,
                  citations,
                  streaming: true,
                }
              : message,
          ),
        );
      }

      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantId
            ? {
                ...message,
                content: accumulated,
                citations,
                streaming: false,
              }
            : message,
        ),
      );
      refreshSessions();
    } catch (error) {
      if ((error as Error).name === "AbortError") return;
      const message =
        error instanceof Error ? error.message : "Failed to get a reply.";
      toast.error(message);
      setMessages((prev) =>
        prev.filter((item) => item.id !== assistantId || item.content.length > 0),
      );
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  };

  const onNewChat = async () => {
    const created = await createChatSession(bookId);
    if (!created.success || !created.data) {
      toast.error("Could not create a new chat.");
      return;
    }
    const session = created.data as IChatSession;
    setSessionId(session.id);
    setMessages([]);
    refreshSessions();
  };

  const onSelectSession = async (id: string) => {
    if (id === sessionId || busy) return;
    setSessionId(id);
    setLoading(true);
    const { getChatMessages } = await import("@/lib/actions/chat.actions");
    const result = await getChatMessages(id);
    if (result.success && result.data) {
      setMessages(mapServerMessages(result.data as IChatMessage[]));
    }
    setLoading(false);
  };

  const onDeleteSession = async () => {
    if (!sessionId) return;
    const result = await deleteChatSession(sessionId);
    if (!result.success) {
      toast.error("Could not delete chat.");
      return;
    }
    setSessionId(null);
    setMessages([]);
    refreshSessions();
    toast.success("Chat deleted");
  };

  const lastUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === "user")?.content;

  return (
    <div className={cn("flex h-full min-h-[22rem] flex-col gap-3", className)}>
      <div className="flex items-center gap-2">
        <select
          className="h-8 min-w-0 flex-1 rounded-full border border-[var(--border-subtle)] bg-[var(--landing-parchment-deep)] px-3 text-xs text-[var(--landing-ink)] outline-none"
          value={sessionId || ""}
          onChange={(event) => {
            if (event.target.value) {
              void onSelectSession(event.target.value);
            }
          }}
          disabled={busy || sessions.length === 0}
          aria-label="Chat history"
        >
          {sessions.length === 0 ? (
            <option value="">No chats yet</option>
          ) : (
            sessions.map((session) => (
              <option key={session.id} value={session.id}>
                {session.title || "Untitled chat"}
              </option>
            ))
          )}
        </select>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="rounded-full"
          onClick={onNewChat}
          disabled={busy}
          aria-label="New chat"
        >
          <Plus className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="rounded-full"
          onClick={onDeleteSession}
          disabled={busy || !sessionId}
          aria-label="Delete chat"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto rounded-2xl border border-[var(--border-subtle)] bg-card/40 p-3 [scrollbar-width:thin]">
        {loading ? (
          <div className="flex h-full items-center justify-center gap-2 text-sm text-[var(--text-secondary)]">
            <LoaderCircle className="size-4 animate-spin" />
            Loading chat…
          </div>
        ) : messages.length === 0 ? (
          <div className="space-y-4 py-2">
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
              Ask about this book. Answers use retrieved passages and cite pages
              when available.
            </p>
            <SuggestedActions
              currentPage={currentPage}
              disabled={busy}
              onSelect={(prompt) => void sendMessage(prompt)}
            />
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessageBubble
              key={message.id}
              role={message.role}
              content={message.content}
              citations={message.citations}
              isStreaming={message.streaming}
              showRegenerate={
                !busy &&
                index === messages.length - 1 &&
                message.role === "assistant" &&
                Boolean(lastUserMessage)
              }
              onRegenerate={() => {
                if (lastUserMessage) {
                  void sendMessage(lastUserMessage, { regenerate: true });
                }
              }}
              onJumpToPage={onJumpToPage}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length > 0 ? (
        <SuggestedActions
          currentPage={currentPage}
          disabled={busy}
          onSelect={(prompt) => void sendMessage(prompt)}
        />
      ) : null}

      <form
        className="flex items-end gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          void sendMessage(input);
        }}
      >
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          rows={2}
          placeholder="Ask about this book…"
          disabled={busy}
          className="min-h-[2.75rem] flex-1 resize-none rounded-2xl border border-[var(--border-subtle)] bg-[var(--landing-parchment-deep)] px-3 py-2 text-sm text-[var(--landing-ink)] outline-none focus-visible:border-[var(--landing-maroon)] focus-visible:ring-[3px] focus-visible:ring-[var(--landing-maroon)]/20"
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void sendMessage(input);
            }
          }}
        />
        <Button
          type="submit"
          size="icon"
          className="rounded-full"
          disabled={busy || !input.trim()}
          aria-label="Send message"
        >
          {busy ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
