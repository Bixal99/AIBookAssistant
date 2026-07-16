"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";

import {
  getUnreadCount,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/actions/notification.actions";
import { ROUTES } from "@/lib/auth-constants";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Notif = {
  id: string;
  title: string;
  message?: string | null;
  link?: string | null;
  isRead: boolean;
  createdAt: string | Date;
};

function relativeTime(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString();
}

export default function NotificationsPopover() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notif[]>([]);
  const [unread, setUnread] = useState(0);
  const [pending, startTransition] = useTransition();

  const refresh = useCallback(() => {
    startTransition(async () => {
      const [list, count] = await Promise.all([
        listNotifications(12),
        getUnreadCount(),
      ]);
      if (list.success) setItems(list.data as Notif[]);
      if (count.success) setUnread(count.count);
    });
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 60000);
    return () => clearInterval(id);
  }, [refresh]);

  useEffect(() => {
    if (open) refresh();
  }, [open, refresh]);

  const onItemClick = async (n: Notif) => {
    if (!n.isRead) {
      await markNotificationRead(n.id);
      setUnread((c) => Math.max(0, c - 1));
      setItems((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)),
      );
    }
    setOpen(false);
    if (n.link) {
      router.push(n.link);
    }
  };

  const onMarkAll = async () => {
    await markAllNotificationsRead();
    setUnread(0);
    setItems((prev) => prev.map((x) => ({ ...x, isRead: true })));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative"
        >
          <Bell className="size-4" />
          {unread > 0 ? (
            <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--landing-maroon)] px-1 text-[10px] font-semibold text-white">
              {unread > 9 ? "9+" : unread}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-3">
          <h3 className="font-serif text-sm font-semibold">Notifications</h3>
          {unread > 0 ? (
            <button
              type="button"
              onClick={onMarkAll}
              className="text-xs font-medium text-[var(--landing-maroon)] hover:underline"
            >
              Mark all as read
            </button>
          ) : null}
        </div>

        <div className="max-h-80 overflow-y-auto">
          {pending && items.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-[var(--text-secondary)]">
              Loading…
            </p>
          ) : items.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="font-medium text-[var(--landing-ink)]">
                You&apos;re all caught up.
              </p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                New activity will appear here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-[var(--border-subtle)]">
              {items.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => onItemClick(n)}
                    className={cn(
                      "flex w-full flex-col gap-0.5 px-4 py-3 text-left transition-colors hover:bg-[var(--landing-maroon-soft)]",
                      !n.isRead && "bg-[var(--landing-maroon-soft)]/40",
                    )}
                  >
                    <span className="text-sm font-medium text-[var(--landing-ink)]">
                      {n.title}
                    </span>
                    {n.message ? (
                      <span className="line-clamp-2 text-xs text-[var(--text-secondary)]">
                        {n.message}
                      </span>
                    ) : null}
                    <span className="text-[11px] text-[var(--text-secondary)]">
                      {relativeTime(n.createdAt)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-[var(--border-subtle)] px-4 py-2.5">
          <Link
            href={ROUTES.notifications}
            onClick={() => setOpen(false)}
            className="text-xs font-medium text-[var(--landing-maroon)] hover:underline"
          >
            View all
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
