/**
 * DashboardOverview — The main landing screen of the analytics app.
 *
 * Layout (top → bottom):
 *  1. Four KPI metric cards (sessions, bounce, session length, conversion)
 *  2. Primary critical insight card with action CTAs
 *  3. Two secondary insight cards (warning + success)
 *  4. Daily Active Users chart + Top Drop-off Pages table
 *
 * Data flow: All data comes from static mock constants in ./data/.
 * State: `loading` simulates an API fetch delay; `chartError` toggles error UI.
 */

import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DailyActiveUsersChart } from "@/components/charts/DailyActiveUsersChart";
import { TopDropOffPages } from "@/components/charts/TopDropOffPages";
import { InsightCardSkeleton, KPICardSkeleton } from "@/components/feedback/CardSkeleton";
import { CardErrorState } from "@/components/feedback/CardErrorState";
import { MetricCard } from "./components/MetricCard";
import { useDashboardMetrics } from "@/hooks/useDashboardData";
import { primaryInsight, secondaryInsights } from "./data/dashboardData";
import {
  TrendingDown, ArrowRight, AlertTriangle, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardOverview = () => {
  const navigate = useNavigate();
  const { data: dashboardMetrics, isLoading: loading, isError: metricsError, refetch: retryMetrics } = useDashboardMetrics();

  /* ---------- Loading skeleton ---------- */
  if (loading) {
    return (
      <DashboardLayout title="Home">
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

  return (
    <DashboardLayout title="Home">
      {/* KPI Metric Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {dashboardMetrics.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>

      {/* Primary Insight — critical alert */}
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
              <span className="text-[11px] text-muted-foreground">• {primaryInsight.timeAgo}</span>
            </div>
            <h2 className="text-base font-semibold text-foreground leading-snug">{primaryInsight.title}</h2>
            <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">{primaryInsight.description}</p>
            <div className="flex items-center gap-2.5 mt-3">
              <Button size="sm" variant="destructive" className="rounded-lg text-[13px] h-8 gap-1.5 group-hover:gap-2 transition-all font-medium">
                Fix Checkout Drop-off <ArrowRight className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" variant="outline" className="rounded-lg text-[13px] h-8 gap-1.5" onClick={(e) => { e.stopPropagation(); navigate("/insight/performance-drop"); }}>
                Analyze Root Cause
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {secondaryInsights.map((insight) => (
          <div
            key={insight.title}
            className={`asana-card p-4 border-l-4 cursor-pointer hover:shadow-md transition-shadow group ${
              insight.type === "warning" ? "border-l-chart-warning" : "border-l-chart-success"
            }`}
            onClick={() => navigate("/insight/performance-drop")}
          >
            <div className="flex items-start gap-3">
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                insight.type === "warning" ? "bg-chart-warning/10" : "bg-chart-success/10"
              }`}>
                {insight.type === "warning"
                  ? <AlertTriangle className="h-4.5 w-4.5 text-chart-warning" />
                  : <Zap className="h-4.5 w-4.5 text-chart-success" />}
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-foreground">{insight.title}</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">{insight.description}</p>
                <div className={`flex items-center gap-1 mt-2 text-[12px] font-semibold group-hover:gap-2 transition-all ${
                  insight.type === "warning" ? "text-chart-warning" : "text-chart-success"
                }`}>
                  <span>{insight.cta}</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {chartError ? (
          <CardErrorState onRetry={() => setChartError(false)} />
        ) : (
          <DailyActiveUsersChart />
        )}
        <TopDropOffPages />
      </div>
    </DashboardLayout>
  );
};

export default DashboardOverview;
