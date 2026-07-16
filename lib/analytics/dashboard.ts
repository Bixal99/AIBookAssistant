import { unstable_noStore as noStore } from "next/cache";

import { prisma } from "@/lib/db";

export type ChartRange = "7d" | "30d" | "90d" | "year";

export type KpiCard = {
  key: string;
  label: string;
  value: number;
  previousValue: number;
  trendPercent: number | null;
  format: "number" | "bytes" | "duration" | "percent";
  hint: string;
};

export type NamedValue = { name: string; value: number };
export type TimePoint = { date: string; value: number };

function daysForRange(range: ChartRange): number {
  switch (range) {
    case "7d":
      return 7;
    case "30d":
      return 30;
    case "90d":
      return 90;
    case "year":
      return 365;
  }
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function formatDayKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatMonthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function trend(current: number, previous: number): number | null {
  if (previous === 0) {
    return current === 0 ? 0 : null;
  }
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

function fillDailySeries(
  from: Date,
  to: Date,
  counts: Map<string, number>,
): TimePoint[] {
  const points: TimePoint[] = [];
  let cursor = startOfDay(from);
  const end = startOfDay(to);
  while (cursor <= end) {
    const key = formatDayKey(cursor);
    points.push({ date: key, value: counts.get(key) ?? 0 });
    cursor = addDays(cursor, 1);
  }
  return points;
}

export async function getDashboardAnalytics(
  userId: string,
  range: ChartRange = "30d",
) {
  noStore();
  const now = new Date();
  const rangeDays = daysForRange(range);
  const rangeStart = startOfDay(addDays(now, -rangeDays + 1));
  const prevRangeStart = startOfDay(addDays(rangeStart, -rangeDays));
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthEnd = monthStart;

  const [
    totalBooks,
    booksThisMonth,
    booksPrevMonth,
    voiceSessionsTotal,
    voiceSessionsPrevPeriod,
    voiceSessionsThisPeriod,
    storageAgg,
    booksWithVoice,
    avgDuration,
    recentBooks,
    readingProgress,
    recentVoiceSessions,
    booksInRange,
    voiceInRange,
    categoryGroups,
    authorGroups,
  ] = await Promise.all([
    prisma.book.count({ where: { userId } }),
    prisma.book.count({
      where: { userId, createdAt: { gte: monthStart } },
    }),
    prisma.book.count({
      where: {
        userId,
        createdAt: { gte: prevMonthStart, lt: prevMonthEnd },
      },
    }),
    prisma.voiceSession.count({ where: { userId } }),
    prisma.voiceSession.count({
      where: {
        userId,
        startedAt: { gte: prevRangeStart, lt: rangeStart },
      },
    }),
    prisma.voiceSession.count({
      where: { userId, startedAt: { gte: rangeStart } },
    }),
    prisma.book.aggregate({
      where: { userId },
      _sum: { fileSize: true },
    }),
    prisma.book.count({
      where: { userId, voiceSessions: { some: {} } },
    }),
    prisma.voiceSession.aggregate({
      where: { userId, endedAt: { not: null } },
      _avg: { durationSeconds: true },
    }),
    prisma.book.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { categories: { include: { category: true } } },
    }),
    prisma.readingProgress.findMany({
      where: { userId },
      orderBy: { lastOpenedAt: "desc" },
      include: { book: true },
    }),
    prisma.voiceSession.findMany({
      where: { userId },
      orderBy: { startedAt: "desc" },
      include: { book: { select: { id: true, title: true, slug: true } } },
    }),
    prisma.book.findMany({
      where: { userId, createdAt: { gte: rangeStart } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.voiceSession.findMany({
      where: { userId, startedAt: { gte: rangeStart } },
      select: { startedAt: true, durationSeconds: true },
      orderBy: { startedAt: "asc" },
    }),
    prisma.bookCategory.groupBy({
      by: ["categoryId"],
      where: { book: { userId } },
      _count: { _all: true },
      orderBy: { _count: { categoryId: "desc" } },
      take: 8,
    }),
    prisma.book.groupBy({
      by: ["author"],
      where: { userId },
      _count: { _all: true },
      orderBy: { _count: { author: "desc" } },
      take: 8,
    }),
  ]);

  const pdfStorage = storageAgg._sum.fileSize ?? 0;
  const totalStorage = pdfStorage;
  const booksWithoutVoice = Math.max(0, totalBooks - booksWithVoice);

  const avgDurationPrev = await prisma.voiceSession.aggregate({
    where: {
      userId,
      endedAt: { not: null },
      startedAt: { gte: prevRangeStart, lt: rangeStart },
    },
    _avg: { durationSeconds: true },
  });

  const kpis: KpiCard[] = [
    {
      key: "totalBooks",
      label: "Total Books",
      value: totalBooks,
      previousValue: Math.max(0, totalBooks - booksThisMonth),
      trendPercent: trend(booksThisMonth, booksPrevMonth),
      format: "number",
      hint: "Books in your personal library",
    },
    {
      key: "booksThisMonth",
      label: "Uploaded This Month",
      value: booksThisMonth,
      previousValue: booksPrevMonth,
      trendPercent: trend(booksThisMonth, booksPrevMonth),
      format: "number",
      hint: "New uploads since the 1st of this month",
    },
    {
      key: "voiceSessions",
      label: "Voice Sessions",
      value: voiceSessionsTotal,
      previousValue: Math.max(0, voiceSessionsTotal - voiceSessionsThisPeriod),
      trendPercent: trend(voiceSessionsThisPeriod, voiceSessionsPrevPeriod),
      format: "number",
      hint: "Total voice conversations with your books",
    },
    {
      key: "storage",
      label: "Storage Used",
      value: totalStorage,
      previousValue: totalStorage,
      trendPercent: 0,
      format: "bytes",
      hint: "PDF storage from your uploads",
    },
    {
      key: "aiConversations",
      label: "AI Conversations",
      value: voiceSessionsTotal,
      previousValue: Math.max(0, voiceSessionsTotal - voiceSessionsThisPeriod),
      trendPercent: trend(voiceSessionsThisPeriod, voiceSessionsPrevPeriod),
      format: "number",
      hint: "Voice sessions (text chat coming later)",
    },
    {
      key: "avgDuration",
      label: "Avg Session Duration",
      value: Math.round(avgDuration._avg.durationSeconds ?? 0),
      previousValue: Math.round(avgDurationPrev._avg.durationSeconds ?? 0),
      trendPercent: trend(
        avgDuration._avg.durationSeconds ?? 0,
        avgDurationPrev._avg.durationSeconds ?? 0,
      ),
      format: "duration",
      hint: "Average length of completed voice sessions",
    },
  ];

  const uploadCounts = new Map<string, number>();
  for (const b of booksInRange) {
    const key = formatDayKey(b.createdAt);
    uploadCounts.set(key, (uploadCounts.get(key) ?? 0) + 1);
  }

  const voiceCounts = new Map<string, number>();
  for (const s of voiceInRange) {
    const key = formatDayKey(s.startedAt);
    voiceCounts.set(
      key,
      (voiceCounts.get(key) ?? 0) + (s.durationSeconds || 0),
    );
  }

  const uploadActivity = fillDailySeries(rangeStart, now, uploadCounts);
  const voiceUsage = fillDailySeries(rangeStart, now, voiceCounts);

  const categoryIds = categoryGroups.map((g) => g.categoryId);
  const categories =
    categoryIds.length > 0
      ? await prisma.category.findMany({
          where: { id: { in: categoryIds } },
        })
      : [];
  const categoryNameById = new Map(categories.map((c) => [c.id, c.name]));

  const uploadCategories: NamedValue[] = categoryGroups.map((g) => ({
    name: categoryNameById.get(g.categoryId) ?? "Uncategorized",
    value: g._count._all,
  }));

  const topAuthors: NamedValue[] = authorGroups.map((g) => ({
    name: g.author,
    value: g._count._all,
  }));

  const libraryEngagement: NamedValue[] = [
    { name: "With voice sessions", value: booksWithVoice },
    { name: "Not started yet", value: booksWithoutVoice },
  ].filter((x) => x.value > 0);

  // Monthly uploads for last 12 months
  const yearStart = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const monthlyBooks = await prisma.book.findMany({
    where: { userId, createdAt: { gte: yearStart } },
    select: { createdAt: true },
  });
  const monthCounts = new Map<string, number>();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    monthCounts.set(formatMonthKey(d), 0);
  }
  for (const b of monthlyBooks) {
    const key = formatMonthKey(b.createdAt);
    if (monthCounts.has(key)) {
      monthCounts.set(key, (monthCounts.get(key) ?? 0) + 1);
    }
  }
  const monthlyUploads: TimePoint[] = [...monthCounts.entries()].map(
    ([date, value]) => ({ date, value }),
  );

  return {
    kpis,
    uploadActivity,
    uploadCategories,
    voiceUsage,
    topAuthors,
    libraryEngagement,
    storageTotal: totalStorage,
    monthlyUploads,
    recentBooks,
    readingProgress,
    recentVoiceSessions,
    userBookCount: totalBooks,
  };
}

export type DashboardAnalytics = Awaited<
  ReturnType<typeof getDashboardAnalytics>
>;
