/**
 * DashboardOverview — The main landing screen of the analytics app.
 *
 * Layout (top → bottom):
 *  1. Four KPI metric cards (sessions, bounce, session length, conversion)
 *  2. Primary critical insight card with action CTAs
 *  3. Two secondary insight cards (warning + success)
 *  4. Daily Active Users chart + Top Drop-off Pages table
 *
 * Data flow: KPI metrics from analytics_events, insights from insights table,
 * DAU from analytics_events, drop-off from page_analytics.
 * All time-based queries respect the selected DateRangeFilter.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DailyActiveUsersChart } from "@/components/charts/DailyActiveUsersChart";
import { TopDropOffPages } from "@/components/charts/TopDropOffPages";
import { InsightCardSkeleton, KPICardSkeleton } from "@/components/feedback/CardSkeleton";
import { CardErrorState } from "@/components/feedback/CardErrorState";
import { CardEmptyState } from "@/components/feedback/CardEmptyState";
import { DateRangeFilter } from "@/components/filters/DateRangeFilter";
import { MetricCard } from "./components/MetricCard";
import { useDashboardMetrics, type DateRangeParam } from "@/hooks/useDashboardData";
import { useInsights } from "@/hooks/useInsights";
import {
  TrendingDown, ArrowRight, AlertTriangle, Zap, Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

const DashboardOverview = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 14),
    to: new Date(),
  });

  // Convert DateRange (react-day-picker) to DateRangeParam for hooks
  const hookRange: DateRangeParam | undefined =
    dateRange?.from && dateRange?.to
      ? { from: dateRange.from, to: dateRange.to }
      : undefined;

  const { data: dashboardMetrics, isLoading: loading, isError: metricsError, refetch: retryMetrics } = useDashboardMetrics(hookRange);
  const { data: insights, isLoading: insightsLoading, isError: insightsError, refetch: retryInsights } = useInsights();

  const primaryInsight = insights?.find((i) => i.severity === "critical");
  const secondaryInsights = insights?.filter((i) => i.severity !== "critical").slice(0, 2) ?? [];

  /* ---------- Loading skeleton ---------- */
  if (loading || insightsLoading) {
    return (
      <DashboardLayout
        title="Home"
        headerContent={<DateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} />}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICardSkeleton />
          <KPICardSkeleton />
          <KPICardSkeleton />
          <KPICardSkeleton />
        </div>
        <InsightCardSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InsightCardSkeleton />
          <InsightCardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <InsightCardSkeleton />
          <InsightCardSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  const timeAgo = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: false }) + " ago";
    } catch {
      return "";
    }
  };

  return (
    <DashboardLayout
      title="Home"
      headerContent={<DateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} />}
    >
      {/* KPI Metric Bar */}
      {metricsError ? (
        <CardErrorState title="Metrics unavailable" message="Could not load dashboard metrics." onRetry={() => retryMetrics()} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(dashboardMetrics ?? []).map((m) => (
            <MetricCard key={m.label} {...m} />
          ))}
        </div>
      )}

      {/* Insight Cards */}
      {insightsError ? (
        <CardErrorState title="Insights unavailable" message="Could not load insights." onRetry={() => retryInsights()} />
      ) : !insights?.length ? (
        <CardEmptyState title="No insights yet" message="Insights will appear here once enough analytics data has been collected." />
      ) : (
        <>
          {/* Primary Insight — critical alert */}
          {primaryInsight && (
            <div
              className="asana-card p-5 border-l-4 border-l-destructive cursor-pointer hover:shadow-md transition-shadow group"
              onClick={() => navigate("/insight/performance-drop")}
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                  <TrendingDown className="h-6 w-6 text-destructive" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-destructive/10 text-[11px] uppercase tracking-wider font-bold text-destructive">
                      <AlertTriangle className="h-3 w-3" /> Critical
                    </span>
                    <span className="text-[11px] text-muted-foreground">• {primaryInsight.metadata.timeAgo || timeAgo(primaryInsight.createdAt)}</span>
                  </div>
                  <h2 className="text-base font-semibold text-foreground leading-snug">{primaryInsight.title}</h2>
                  <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">{primaryInsight.description}</p>
                  <div className="flex items-center gap-2.5 mt-3">
                    <Button size="sm" variant="destructive" className="rounded-lg text-[13px] h-8 gap-1.5 group-hover:gap-2 transition-all font-medium">
                      {primaryInsight.metadata.cta || "View Details"} <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                    {primaryInsight.metadata.cta2 && (
                      <Button size="sm" variant="outline" className="rounded-lg text-[13px] h-8 gap-1.5" onClick={(e) => { e.stopPropagation(); navigate("/insight/performance-drop"); }}>
                        {primaryInsight.metadata.cta2}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Secondary Insights */}
          {secondaryInsights.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {secondaryInsights.map((insight) => (
                <div
                  key={insight.id}
                  className={`asana-card p-4 border-l-4 cursor-pointer hover:shadow-md transition-shadow group ${
                    insight.severity === "warning" ? "border-l-chart-warning" : "border-l-chart-success"
                  }`}
                  onClick={() => navigate("/insight/performance-drop")}
                >
                  <div className="flex items-start gap-3">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                      insight.severity === "warning" ? "bg-chart-warning/10" : "bg-chart-success/10"
                    }`}>
                      {insight.severity === "warning"
                        ? <AlertTriangle className="h-4.5 w-4.5 text-chart-warning" />
                        : <Zap className="h-4.5 w-4.5 text-chart-success" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-semibold text-foreground">{insight.title}</p>
                      <p className="text-[12px] text-muted-foreground mt-0.5">{insight.description}</p>
                      <div className={`flex items-center gap-1 mt-2 text-[12px] font-semibold group-hover:gap-2 transition-all ${
                        insight.severity === "warning" ? "text-chart-warning" : "text-chart-success"
                      }`}>
                        <span>{insight.metadata.cta || "View Details"}</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Charts + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DailyActiveUsersChart range={hookRange} />
        <TopDropOffPages range={hookRange} />
      </div>
    </DashboardLayout>
  );
};

export default DashboardOverview;
