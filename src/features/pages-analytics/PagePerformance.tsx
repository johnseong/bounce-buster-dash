/**
 * PagePerformance — Lists all tracked pages with views, bounce rate, and trend.
 * Powered by live data from page_analytics table with date range filtering.
 */

import { useState } from "react";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ExternalLink, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { usePageAnalytics } from "@/hooks/usePageAnalytics";
import { type DateRangeParam } from "@/hooks/useDashboardData";
import { DateRangeFilter } from "@/components/filters/DateRangeFilter";
import { Skeleton } from "@/components/ui/skeleton";
import { CardEmptyState } from "@/components/feedback/CardEmptyState";
import { CardErrorState } from "@/components/feedback/CardErrorState";

export default function PagePerformance() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 14),
    to: new Date(),
  });

  const hookRange: DateRangeParam | undefined =
    dateRange?.from && dateRange?.to
      ? { from: dateRange.from, to: dateRange.to }
      : undefined;

  const { data: pages, isLoading, isError } = usePageAnalytics(hookRange);

  if (isError) {
    return (
      <DashboardLayout title="Pages" headerContent={<DateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} />}>
        <CardErrorState title="Failed to load pages" message="Could not fetch page analytics data. Please try again later." />
      </DashboardLayout>
    );
  }

  const totalViews = pages?.reduce((s, p) => s + p.views, 0) ?? 0;
  const avgBounce = pages && pages.length > 0 ? Math.round(pages.reduce((s, p) => s + p.bounceRate, 0) / pages.length) : 0;

  return (
    <DashboardLayout title="Pages" headerContent={<DateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} />}>
      <h2 className="text-[20px] font-bold text-foreground">Pages</h2>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="asana-card p-5">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground/60 font-medium">Total Pages</p>
          {isLoading ? <Skeleton className="h-8 w-16 mt-1" /> : (
            <p className="text-[26px] font-bold text-foreground mt-1">{pages?.length ?? 0}</p>
          )}
        </div>
        <div className="asana-card p-5">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground/60 font-medium">Total Views</p>
          {isLoading ? <Skeleton className="h-8 w-24 mt-1" /> : (
            <p className="text-[26px] font-bold text-foreground mt-1">{totalViews.toLocaleString()}</p>
          )}
        </div>
        <div className="asana-card p-5">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground/60 font-medium">Avg. Bounce Rate</p>
          {isLoading ? <Skeleton className="h-8 w-16 mt-1" /> : (
            <p className="text-[26px] font-bold text-foreground mt-1">{avgBounce}%</p>
          )}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="asana-card p-5 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : !pages || pages.length === 0 ? (
        <CardEmptyState title="No pages tracked" message="No page analytics data found — check your integration or adjust the date range." />
      ) : (
        <div className="asana-card overflow-hidden">
          <div className="p-5 border-b border-border">
            <h3 className="text-[15px] font-semibold text-foreground">All Pages</h3>
          </div>
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left font-medium px-5 py-3">Page</th>
                <th className="text-right font-medium px-5 py-3">Views</th>
                <th className="text-right font-medium px-5 py-3">Bounce Rate</th>
                <th className="text-right font-medium px-5 py-3">Avg. Time</th>
                <th className="text-right font-medium px-5 py-3">Trend</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.path} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/50" />
                      <div>
                        <p className="font-medium text-foreground">{page.title}</p>
                        <p className="text-[12px] text-muted-foreground">{page.path}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-right px-5 py-3.5 text-muted-foreground">{page.views.toLocaleString()}</td>
                  <td className="text-right px-5 py-3.5">
                    <span className={`font-medium ${page.bounceRate > 60 ? "text-destructive" : page.bounceRate > 45 ? "text-chart-warning" : "text-chart-success"}`}>{page.bounceRate}%</span>
                  </td>
                  <td className="text-right px-5 py-3.5 text-muted-foreground">{page.avgTime}</td>
                  <td className="text-right px-5 py-3.5">
                    {page.trend === "up" ? <ArrowUpRight className="h-4 w-4 text-chart-success ml-auto" /> : <ArrowDownRight className="h-4 w-4 text-destructive ml-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
