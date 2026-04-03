/**
 * React Query hooks for Dashboard Overview data.
 * Queries: analytics_events, page_analytics tables.
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DashboardMetric {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "flat";
  invertTrend?: boolean;
}

interface DAUPoint {
  date: string;
  dau: number;
}

interface DropOffPage {
  path: string;
  bounceRate: number;
  sessions: number;
}

/** Fetch KPI summary metrics from analytics_events for last 14 days. */
export function useDashboardMetrics() {
  return useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async (): Promise<DashboardMetric[]> => {
      const now = new Date();
      const fourteenDaysAgo = new Date(now);
      fourteenDaysAgo.setDate(now.getDate() - 14);
      const twentyEightDaysAgo = new Date(now);
      twentyEightDaysAgo.setDate(now.getDate() - 28);

      // Current period
      const { data: current, error: e1 } = await supabase
        .from("analytics_events")
        .select("session_id, duration_ms, event_type, device_type")
        .gte("created_at", fourteenDaysAgo.toISOString());
      if (e1) throw e1;

      // Previous period for comparison
      const { data: previous, error: e2 } = await supabase
        .from("analytics_events")
        .select("session_id, duration_ms, event_type, device_type")
        .gte("created_at", twentyEightDaysAgo.toISOString())
        .lt("created_at", fourteenDaysAgo.toISOString());
      if (e2) throw e2;

      const calc = (rows: typeof current) => {
        if (!rows || rows.length === 0) return { sessions: 0, bounceRate: 0, avgSession: 0, conversionRate: 0 };
        const sessionIds = new Set(rows.map((r) => r.session_id));
        const sessions = sessionIds.size;
        const bounces = rows.filter((r) => (r.duration_ms ?? 0) < 60000).length;
        const bounceRate = rows.length > 0 ? (bounces / rows.length) * 100 : 0;
        const totalDur = rows.reduce((s, r) => s + (r.duration_ms ?? 0), 0);
        const avgSession = rows.length > 0 ? totalDur / rows.length : 0;
        const conversions = rows.filter((r) => r.event_type === "conversion").length;
        const conversionRate = rows.length > 0 ? (conversions / rows.length) * 100 : 0;
        return { sessions, bounceRate, avgSession, conversionRate };
      };

      const cur = calc(current);
      const prev = calc(previous);

      const pctChange = (c: number, p: number) => {
        if (p === 0) return "+0%";
        const diff = ((c - p) / p) * 100;
        return `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}%`;
      };

      const formatDuration = (ms: number) => {
        const totalSec = Math.round(ms / 1000);
        const min = Math.floor(totalSec / 60);
        const sec = totalSec % 60;
        return `${min}m ${sec}s`;
      };

      return [
        {
          label: "Total Sessions",
          value: cur.sessions.toLocaleString(),
          change: pctChange(cur.sessions, prev.sessions),
          trend: cur.sessions >= prev.sessions ? "up" as const : "down" as const,
        },
        {
          label: "Bounce Rate",
          value: `${Math.round(cur.bounceRate)}%`,
          change: pctChange(cur.bounceRate, prev.bounceRate),
          trend: cur.bounceRate <= prev.bounceRate ? "down" as const : "up" as const,
          invertTrend: true,
        },
        {
          label: "Avg. Session",
          value: formatDuration(cur.avgSession),
          change: `${cur.avgSession >= prev.avgSession ? "+" : "-"}${Math.abs(Math.round((cur.avgSession - prev.avgSession) / 1000))}s`,
          trend: cur.avgSession >= prev.avgSession ? "up" as const : "down" as const,
        },
        {
          label: "Conversion Rate",
          value: `${cur.conversionRate.toFixed(2)}%`,
          change: pctChange(cur.conversionRate, prev.conversionRate),
          trend: cur.conversionRate >= prev.conversionRate ? "up" as const : "down" as const,
        },
      ];
    },
    staleTime: 5 * 60 * 1000,
  });
}

/** Fetch Daily Active Users for the last 14 days from analytics_events. */
export function useDailyActiveUsers() {
  return useQuery({
    queryKey: ["dashboard-dau"],
    queryFn: async (): Promise<DAUPoint[]> => {
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 15);

      const { data, error } = await supabase
        .from("analytics_events")
        .select("session_id, created_at")
        .gte("created_at", fourteenDaysAgo.toISOString());
      if (error) throw error;

      // Group unique sessions by date
      const byDate: Record<string, Set<string>> = {};
      (data ?? []).forEach((row) => {
        const d = new Date(row.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        if (!byDate[d]) byDate[d] = new Set();
        byDate[d].add(row.session_id);
      });

      // Build ordered array for last 14 days
      const result: DAUPoint[] = [];
      for (let i = 14; i >= 1; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        result.push({ date: label, dau: byDate[label]?.size ?? 0 });
      }
      return result;
    },
    staleTime: 5 * 60 * 1000,
  });
}

/** Fetch top drop-off pages from page_analytics aggregated over last 14 days. */
export function useTopDropOffPages() {
  return useQuery({
    queryKey: ["dashboard-dropoff"],
    queryFn: async (): Promise<DropOffPage[]> => {
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 15);

      const { data, error } = await supabase
        .from("page_analytics")
        .select("page_path, views, bounce_count")
        .gte("date", fourteenDaysAgo.toISOString().split("T")[0]);
      if (error) throw error;

      // Aggregate by page_path
      const agg: Record<string, { views: number; bounces: number }> = {};
      (data ?? []).forEach((row) => {
        if (!agg[row.page_path]) agg[row.page_path] = { views: 0, bounces: 0 };
        agg[row.page_path].views += row.views;
        agg[row.page_path].bounces += row.bounce_count;
      });

      return Object.entries(agg)
        .map(([path, { views, bounces }]) => ({
          path,
          bounceRate: views > 0 ? Math.round((bounces / views) * 100) : 0,
          sessions: views,
        }))
        .sort((a, b) => b.bounceRate - a.bounceRate)
        .slice(0, 5);
    },
    staleTime: 5 * 60 * 1000,
  });
}
