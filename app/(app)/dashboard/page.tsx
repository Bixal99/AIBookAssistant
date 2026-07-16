import { Suspense } from "react";

import { getDashboardAnalytics } from "@/lib/analytics/dashboard";
import { requireSession } from "@/lib/auth-session";
import { ROUTES } from "@/lib/auth-constants";
import { DashboardKpiCards } from "@/components/dashboard/DashboardKpiCards";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import {
  DashboardContinueReading,
  DashboardHero,
  DashboardQuickActions,
  DashboardRecentBooks,
  DashboardVoiceTimeline,
} from "@/components/dashboard/DashboardSections";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await requireSession(ROUTES.dashboard);
  const data = await getDashboardAnalytics(session.user.id, "30d");
  const continueHref = data.readingProgress[0]?.book?.slug
    ? `/books/${data.readingProgress[0].book.slug}`
    : data.userBookCount > 0
      ? ROUTES.library
      : ROUTES.booksNew;

  return (
    <div className="space-y-8">
      <DashboardHero
        name={session.user.name}
        image={session.user.image}
        continueHref={continueHref}
      />

      <DashboardKpiCards kpis={data.kpis} />

      <section className="space-y-3">
        <h2 className="font-serif text-xl font-semibold">Analytics</h2>
        <Suspense
          fallback={
            <div className="h-40 animate-pulse rounded-2xl bg-[var(--bg-secondary)]" />
          }
        >
          <DashboardCharts data={data} range="30d" />
        </Suspense>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl font-semibold">Quick Actions</h2>
        <DashboardQuickActions />
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold">Continue Reading</h2>
          <DashboardContinueReading items={data.readingProgress} />
        </section>
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold">
            Recent Voice Sessions
          </h2>
          <DashboardVoiceTimeline sessions={data.recentVoiceSessions} />
        </section>
      </div>

      <section className="space-y-3">
        <h2 className="font-serif text-xl font-semibold">Recent Books</h2>
        <DashboardRecentBooks books={data.recentBooks} />
      </section>
    </div>
  );
}
