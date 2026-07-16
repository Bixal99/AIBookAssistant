"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Library,
  Settings2,
  Upload,
} from "lucide-react";

import BookCover from "@/components/BookCover";
import LibraryBookActions from "@/components/library/LibraryBookActions";
import { Button } from "@/components/ui/button";
import {
  LocalDate,
  LocalDateTime,
  LocalTime,
  TimeOfDayGreeting,
} from "@/components/ui/local-datetime";
import { ROUTES } from "@/lib/auth-constants";
import type { DashboardAnalytics } from "@/lib/analytics/dashboard";
import { formatDurationLabel } from "@/lib/utils";

export function DashboardHero({
  name,
  image,
  continueHref,
}: {
  name: string;
  image?: string | null;
  continueHref: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-gradient-to-br from-[var(--landing-parchment-deep)] via-[var(--bg-secondary)] to-[var(--landing-maroon-soft)] p-6 sm:p-8"
    >
      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-card">
            {image ? (
              <Image src={image} alt={name} fill className="object-cover" />
            ) : (
              <span className="font-serif text-2xl font-semibold leading-none text-[var(--landing-maroon)]">
                {name.slice(0, 1).toUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0 flex flex-col justify-center">
            <p className="text-sm leading-snug text-[var(--text-secondary)]">
              <TimeOfDayGreeting />,
            </p>
            <h1 className="font-serif text-2xl font-semibold leading-tight text-[var(--landing-ink)] sm:text-3xl">
              {name}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <Button asChild className="rounded-full">
            <Link href={continueHref}>
              <BookOpen className="size-4" />
              Continue Reading
            </Link>
          </Button>
          <Button asChild className="rounded-full">
            <Link href={ROUTES.booksNew}>
              <Upload className="size-4" />
              Upload Book
            </Link>
          </Button>
          <Button asChild className="rounded-full">
            <Link href={ROUTES.library}>
              <Library className="size-4" />
              Open Library
            </Link>
          </Button>
        </div>
      </div>
    </motion.section>
  );
}

export function DashboardQuickActions() {
  const actions = [
    {
      href: ROUTES.booksNew,
      title: "Upload Book",
      desc: "Add a new PDF companion",
      icon: Upload,
    },
    {
      href: ROUTES.library,
      title: "Open Library",
      desc: "Browse your owned books",
      icon: Library,
    },
    {
      href: ROUTES.library,
      title: "Continue Reading",
      desc: "Resume where you left off",
      icon: BookOpen,
    },
    {
      href: ROUTES.library,
      title: "Manage Books",
      desc: "Edit or delete titles",
      icon: Settings2,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {actions.map((a) => (
        <Link
          key={a.title}
          href={a.href}
          className="rounded-2xl border border-[var(--border-subtle)] bg-card p-4 text-card-foreground transition-colors hover:bg-[var(--landing-maroon-soft)]"
        >
          <a.icon className="mb-3 size-5 text-[var(--landing-maroon)]" />
          <p className="font-medium text-[var(--text-primary)]">{a.title}</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{a.desc}</p>
        </Link>
      ))}
    </div>
  );
}

export function DashboardRecentBooks({
  books,
}: {
  books: DashboardAnalytics["recentBooks"];
}) {
  if (!books.length) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--border-subtle)] p-8 text-center text-sm text-[var(--text-secondary)]">
        No books yet.{" "}
        <Link href={ROUTES.booksNew} className="text-[var(--landing-maroon)] underline">
          Upload your first book
        </Link>
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto overscroll-x-contain pb-2 pr-1 [-ms-overflow-style:none] [scrollbar-width:thin]">
      {books.map((book) => (
        <div
          key={book.id}
          className="w-[min(100%,18rem)] shrink-0 rounded-2xl border border-[var(--border-subtle)] bg-card p-4 text-card-foreground"
        >
          <Link href={`/books/${book.slug}`} className="flex gap-3">
            <div className="relative h-[100px] w-[68px] shrink-0 overflow-hidden rounded-lg bg-[var(--bg-secondary)]">
              <BookCover
                src={book.coverURL}
                title={book.title}
                width={68}
                height={100}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate font-serif font-semibold">{book.title}</p>
              <p className="truncate text-sm text-[var(--text-secondary)]">
                {book.author}
              </p>
              <p className="mt-2 text-xs text-[var(--text-muted)]">
                Uploaded <LocalDate value={book.createdAt} />
              </p>
            </div>
          </Link>
          <div className="mt-3">
            <LibraryBookActions
              bookId={book.id}
              title={book.title}
              author={book.author}
              slug={book.slug}
              category={book.categories[0]?.category.name}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardContinueReading({
  items,
}: {
  items: DashboardAnalytics["readingProgress"];
}) {
  const entries = items.filter((item) => item.book?.title && item.book?.slug);

  if (!entries.length) {
    return (
      <p className="text-sm text-[var(--text-secondary)]">
        Open a book to start your reading history.
      </p>
    );
  }

  return (
    <div className="max-h-[22rem] space-y-3 overflow-y-auto overscroll-contain pr-1">
      {entries.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-3 rounded-xl border border-[var(--border-subtle)] bg-card px-3 py-3 text-card-foreground sm:px-4"
        >
          <BookCover
            src={item.book.coverURL}
            title={item.book.title}
            width={40}
            height={56}
            className="h-14 w-10 shrink-0 rounded-md object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-[var(--landing-ink)]">
              {item.book.title}
            </p>
            <p className="truncate text-xs text-[var(--text-secondary)]">
              {item.book.author}
            </p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              Page {item.currentPage}
              {item.totalPages > 0 ? ` / ${item.totalPages}` : ""}
              {" · "}
              {Math.round(item.percentage)}% complete
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Last opened <LocalDateTime value={item.lastOpenedAt} />
            </p>
          </div>
          <Button asChild size="sm" className="shrink-0 rounded-full !text-white">
            <Link href={`/books/${item.book.slug}`}>Resume</Link>
          </Button>
        </div>
      ))}
    </div>
  );
}

export function DashboardVoiceTimeline({
  sessions,
}: {
  sessions: DashboardAnalytics["recentVoiceSessions"];
}) {
  if (!sessions.length) {
    return (
      <p className="text-sm text-[var(--text-secondary)]">
        No voice sessions yet.
      </p>
    );
  }

  return (
    <ol className="relative max-h-[22rem] space-y-4 overflow-y-auto overscroll-contain border-l border-[var(--border-subtle)] pl-5 pr-1">
      {sessions.map((s) => (
        <li key={s.id} className="relative">
          <span className="absolute top-1.5 -left-[1.4rem] size-2.5 rounded-full bg-[var(--landing-maroon)]" />
          <div className="rounded-xl border border-[var(--border-subtle)] bg-card px-4 py-3 text-card-foreground">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Link
                href={`/books/${s.book.slug}`}
                className="font-medium hover:underline"
              >
                {s.book.title}
              </Link>
              <span className="text-xs text-[var(--text-secondary)]">
                {s.endedAt ? "Completed" : "In progress"}
              </span>
            </div>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {formatDurationLabel(s.durationSeconds)} ·{" "}
              <LocalDateTime value={s.startedAt} />
              {s.endedAt ? (
                <>
                  {" → "}
                  <LocalTime value={s.endedAt} />
                </>
              ) : null}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
