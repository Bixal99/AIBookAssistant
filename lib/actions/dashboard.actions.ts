"use server";

import {
  getDashboardAnalytics,
  type ChartRange,
  type DashboardAnalytics,
} from "@/lib/analytics/dashboard";
import { requireSession } from "@/lib/auth-session";
import { ROUTES } from "@/lib/auth-constants";

export type DashboardChartData = Pick<
  DashboardAnalytics,
  | "uploadActivity"
  | "uploadCategories"
  | "voiceUsage"
  | "topAuthors"
  | "libraryEngagement"
  | "monthlyUploads"
>;

const VALID = new Set<ChartRange>(["7d", "30d", "90d", "year"]);

export async function loadDashboardCharts(range: ChartRange): Promise<
  | { success: true; data: DashboardChartData }
  | { success: false; error: string }
> {
  if (!VALID.has(range)) {
    return { success: false, error: "Invalid range" };
  }

  try {
    const session = await requireSession(ROUTES.dashboard);
    const full = await getDashboardAnalytics(session.user.id, range);
    return {
      success: true,
      data: {
        uploadActivity: full.uploadActivity,
        uploadCategories: full.uploadCategories,
        voiceUsage: full.voiceUsage,
        topAuthors: full.topAuthors,
        libraryEngagement: full.libraryEngagement,
        monthlyUploads: full.monthlyUploads,
      },
    };
  } catch {
    return { success: false, error: "Failed to load charts" };
  }
}
