/**
 * React Query hooks for Dashboard Overview data.
 * Queries: analytics_events, page_analytics tables.
 * All hooks accept an optional date range for filtering.
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { subDays, startOfDay, endOfDay, format } from "date-fns";

export interface DateRangeParam {
  from: Date;
  to: Date;
}

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

interface AnalyticsMetricRow {
  session_id: string;
  duration_ms: number | null;
  event_type: string;
}

function getDefaultRange(): DateRangeParam {
  return { from: subDays(new Date(), 14), to: new Date() };
}

async function fetchAnalyticsMetricRows(start: string, end: string): Promise<AnalyticsMetricRow[]> {
  const pageSize = 1000;
  const rows: AnalyticsMetricRow[] = [];

  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from("analytics_events")
      .select("session_id, duration_ms, event_type")
      .gte("created_at", start)
      .lte("created_at", end)
      .order("created_at", { ascending: true })
      .order("id", { ascending: true })
      .range(from, from + pageSize - 1);

    if (error) throw error;
    if (!data?.length) break;
    rows.push(...data);
    if (data.length < pageSize) break;
  }

  return rows;
}

/** Fetch KPI summary metrics from analytics_events for the selected date range. */
export function useDashboardMetrics(range?: DateRangeParam) {
  const r = range ?? getDefaultRange();
  const fromISO = startOfDay(r.from).toISOString();
  const toISO = endOfDay(r.to).toISOString();
  const daysSpan = Math.max(1, Math.round((r.to.getTime() - r.from.getTime()) / 86_400_000));
  const prevFrom = subDays(r.from, daysSpan);
  const prevFromISO = startOfDay(prevFrom).toISOString();
  const prevToISO = startOfDay(r.from).toISOString();

  return useQuery({
    queryKey: ["dashboard-metrics", fromISO, toISO],
    queryFn: async (): Promise<DashboardMetric[]> => {
      const [current, previous] = await Promise.all([
        fetchAnalyticsMetricRows(fromISO, toISO),
        fetchAnalyticsMetricRows(prevFromISO, prevToISO),
      ]);

      const calc = (rows: AnalyticsMetricRow[]) => {
        if (rows.length === 0) return { sessions: 0, bounceRate: 0, avgSession: 0, conversionRate: 0 };
        const sessionIds = new Set(rows.map((r) => r.session_id));
        const sessions = sessionIds.size;
        const bounces = rows.filter((r) => (r.duration_ms ?? 0) < 60000).length;
        const bounceRate = (bounces / rows.length) * 100;
        const totalDur = rows.reduce((sum, row) => sum + (row.duration_ms ?? 0), 0);
        const avgSession = totalDur / rows.length;
        const conversions = rows.filter((r) => r.event_type === "conversion").length;
        const conversionRate = (conversions / rows.length) * 100;
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

/** Fetch Daily Active Users for the selected date range from analytics_events. */
export function useDailyActiveUsers(range?: DateRangeParam) {
  const r = range ?? getDefaultRange();
  const fromISO = startOfDay(r.from).toISOString();
  const toISO = endOfDay(r.to).toISOString();
  const daysSpan = Math.max(1, Math.round((r.to.getTime() - r.from.getTime()) / 86_400_000));

  return useQuery({
    queryKey: ["dashboard-dau", fromISO, toISO],
    queryFn: async (): Promise<DAUPoint[]> => {
      const { data, error } = await supabase
        .from("analytics_events")
        .select("session_id, created_at")
        .gte("created_at", fromISO)
        .lte("created_at", toISO);
      if (error) throw error;

      // Group unique sessions by date
      const byDate: Record<string, Set<string>> = {};
      (data ?? []).forEach((row) => {
        const d = new Date(row.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        if (!byDate[d]) byDate[d] = new Set();
        byDate[d].add(row.session_id);
      });

      // Build ordered array for each day in range
      const result: DAUPoint[] = [];
      for (let i = daysSpan; i >= 0; i--) {
        const date = subDays(r.to, i);
        const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        result.push({ date: label, dau: byDate[label]?.size ?? 0 });
      }
      return result;
    },
    staleTime: 5 * 60 * 1000,
  });
}

/** Fetch top drop-off pages from page_analytics for the selected date range. */
export function useTopDropOffPages(range?: DateRangeParam) {
  const r = range ?? getDefaultRange();
  const fromDate = format(startOfDay(r.from), "yyyy-MM-dd");
  const toDate = format(endOfDay(r.to), "yyyy-MM-dd");

  return useQuery({
    queryKey: ["dashboard-dropoff", fromDate, toDate],
    queryFn: async (): Promise<DropOffPage[]> => {
      const { data, error } = await supabase
        .from("page_analytics")
        .select("page_path, views, bounce_count")
        .gte("date", fromDate)
        .lte("date", toDate);
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
