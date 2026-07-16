import Link from "next/link";

import { listNotifications } from "@/lib/actions/notification.actions";
import { Button } from "@/components/ui/button";
import { MarkAllReadButton } from "@/components/shell/MarkAllReadButton";
import { ROUTES } from "@/lib/auth-constants";

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

export default async function NotificationsPage() {
  const result = await listNotifications(50);
  const items = result.success ? result.data : [];
  const unread = items.filter((n: { isRead: boolean }) => !n.isRead).length;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[var(--landing-ink)]">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Your BookBy activity feed
          </p>
        </div>
        {unread > 0 ? <MarkAllReadButton /> : null}
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border-subtle)] bg-[var(--landing-parchment-deep)]/40 px-6 py-12 text-center">
          <p className="font-medium text-[var(--landing-ink)]">
            You&apos;re all caught up.
          </p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            New activity will appear here when you upload books or finish voice
            sessions.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-[var(--border-subtle)] overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--landing-parchment-deep)]/30">
          {items.map(
            (n: {
              id: string;
              title: string;
              message?: string | null;
              link?: string | null;
              isRead: boolean;
              createdAt: string | Date;
            }) => (
              <li key={n.id}>
                {n.link ? (
                  <Link
                    href={n.link}
                    className={`block px-5 py-4 transition-colors hover:bg-[var(--landing-maroon-soft)] ${
                      !n.isRead ? "bg-[var(--landing-maroon-soft)]/30" : ""
                    }`}
                  >
                    <p className="font-medium text-[var(--landing-ink)]">
                      {n.title}
                    </p>
                    {n.message ? (
                      <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
                        {n.message}
                      </p>
                    ) : null}
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">
                      {relativeTime(n.createdAt)}
                    </p>
                  </Link>
                ) : (
                  <div
                    className={`px-5 py-4 ${
                      !n.isRead ? "bg-[var(--landing-maroon-soft)]/30" : ""
                    }`}
                  >
                    <p className="font-medium text-[var(--landing-ink)]">
                      {n.title}
                    </p>
                    {n.message ? (
                      <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
                        {n.message}
                      </p>
                    ) : null}
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">
                      {relativeTime(n.createdAt)}
                    </p>
                  </div>
                )}
              </li>
            ),
          )}
        </ul>
      )}

      <Button asChild className="rounded-full !text-white">
        <Link href={ROUTES.dashboard}>Back to dashboard</Link>
      </Button>
    </div>
  );
}
