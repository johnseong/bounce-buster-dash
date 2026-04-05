/**
 * usePageAnalytics — fetches aggregated per-page metrics from page_analytics.
 *
 * Fields used: page_path, page_title, views, bounce_count, unique_visitors, total_duration_ms, date
 * Aggregates across all dates to produce per-page totals, then derives bounce rate and avg time.
 * Trend is computed by comparing the latest half of dates to the earlier half.
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PageRow {
  path: string;
  title: string;
  views: number;
  bounceRate: number;
  avgTime: string;
  trend: "up" | "down";
}

export function usePageAnalytics() {
  return useQuery({
    queryKey: ["page-analytics-pages"],
    queryFn: async (): Promise<PageRow[]> => {
      // Fetch all rows (paginated to bypass 1k limit)
      let allRows: any[] = [];
      let from = 0;
      const PAGE = 1000;
      while (true) {
        const { data, error } = await supabase
          .from("page_analytics")
          .select("page_path, page_title, views, bounce_count, total_duration_ms, date")
          .order("date", { ascending: true })
          .range(from, from + PAGE - 1);
        if (error) throw error;
        if (!data || data.length === 0) break;
        allRows = allRows.concat(data);
        if (data.length < PAGE) break;
        from += PAGE;
      }

      if (allRows.length === 0) return [];

      // Find midpoint date for trend calculation
      const dates = [...new Set(allRows.map((r) => r.date))].sort();
      const mid = Math.floor(dates.length / 2);
      const earlyDates = new Set(dates.slice(0, mid));

      // Aggregate per page
      const map = new Map<string, {
        title: string;
        views: number;
        bounceCount: number;
        totalDurMs: number;
        totalRows: number;
        earlyViews: number;
        lateViews: number;
      }>();

      for (const r of allRows) {
        let entry = map.get(r.page_path);
        if (!entry) {
          entry = { title: r.page_title || r.page_path, views: 0, bounceCount: 0, totalDurMs: 0, totalRows: 0, earlyViews: 0, lateViews: 0 };
          map.set(r.page_path, entry);
        }
        entry.views += r.views;
        entry.bounceCount += r.bounce_count;
        entry.totalDurMs += Number(r.total_duration_ms);
        entry.totalRows += r.views; // use views as weight for avg
        if (earlyDates.has(r.date)) {
          entry.earlyViews += r.views;
        } else {
          entry.lateViews += r.views;
        }
      }

      const result: PageRow[] = [];
      for (const [path, e] of map) {
        const bounceRate = e.views > 0 ? Math.round((e.bounceCount / e.views) * 100) : 0;
        const avgMs = e.views > 0 ? e.totalDurMs / e.views : 0;
        const avgSec = Math.round(avgMs / 1000);
        const mins = Math.floor(avgSec / 60);
        const secs = avgSec % 60;
        const avgTime = `${mins}m ${secs.toString().padStart(2, "0")}s`;
        const trend: "up" | "down" = e.lateViews >= e.earlyViews ? "up" : "down";
        result.push({ path, title: e.title, views: e.views, bounceRate, avgTime, trend });
      }

      result.sort((a, b) => b.views - a.views);
      return result;
    },
    staleTime: 60_000,
  });
}
