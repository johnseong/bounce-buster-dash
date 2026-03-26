import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DAUChart } from "@/components/DAUChart";
import { TopDropOffPages } from "@/components/TopDropOffPages";
import { InsightCardSkeleton, KPICardSkeleton, ChartSkeleton, TableSkeleton } from "@/components/CardSkeleton";
import { CardErrorState } from "@/components/CardErrorState";
import {
  TrendingDown,
  Clock,
  Users,
  ArrowRight,
  AlertTriangle,
  Zap,
  Eye,
  MousePointerClick,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [chartError, setChartError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

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
          <ChartSkeleton />
          <TableSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Home">
      {/* Top Metric Bar — large numbers like reference */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Total Sessions"
          value="79,842"
          change="+12.4%"
          trend="up"
          icon={<Eye className="h-4 w-4" />}
        />
        <MetricCard
          label="Bounce Rate"
          value="60%"
          change="-2.4%"
          trend="down"
          icon={<TrendingDown className="h-4 w-4" />}
          invertTrend
        />
        <MetricCard
          label="Avg. Session"
          value="1m 42s"
          change="+8s"
          trend="up"
          icon={<Clock className="h-4 w-4" />}
        />
        <MetricCard
          label="Conversion Rate"
          value="4.27%"
          change="+0.8%"
          trend="up"
          icon={<MousePointerClick className="h-4 w-4" />}
        />
      </div>

      {/* Primary Insight */}
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
              <span className="text-[11px] text-muted-foreground">• 2 hours ago</span>
            </div>
            <h2 className="text-base font-semibold text-foreground leading-snug">
              Performance dropped 15% — mobile bounce rate surged to 72%
            </h2>
            <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">
              Mobile visitors leave after 48s on average. The checkout funnel lost 740 users at the "Add to Cart → Checkout" step.
            </p>
            <div className="flex items-center gap-2.5 mt-3">
              <Button size="sm" variant="destructive" className="rounded-lg text-[13px] h-8 gap-1.5 group-hover:gap-2 transition-all font-medium">
                Fix Checkout Drop-off
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" variant="outline" className="rounded-lg text-[13px] h-8 gap-1.5" onClick={(e) => { e.stopPropagation(); navigate("/insight/performance-drop"); }}>
                Analyze Root Cause
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="asana-card p-4 border-l-4 border-l-chart-warning cursor-pointer hover:shadow-md transition-shadow group"
          onClick={() => navigate("/insight/performance-drop")}
        >
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-chart-warning/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-4.5 w-4.5 text-chart-warning" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-foreground">Mobile landing page loads in 4.2s — 72% bounce</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                Slow load time on mobile is the #1 driver. Desktop loads in 1.8s with only 45% bounce.
              </p>
              <div className="flex items-center gap-1 mt-2 text-chart-warning text-[12px] font-semibold group-hover:gap-2 transition-all">
                <span>Optimize Mobile Speed</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>

        <div
          className="asana-card p-4 border-l-4 border-l-chart-success cursor-pointer hover:shadow-md transition-shadow group"
          onClick={() => navigate("/insight/performance-drop")}
        >
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-chart-success/10 flex items-center justify-center shrink-0">
              <Zap className="h-4.5 w-4.5 text-chart-success" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-foreground">Docs engagement up 25% — avg session 5m 44s</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                Users who visit Docs convert 3× more. Consider promoting it in onboarding.
              </p>
              <div className="flex items-center gap-1 mt-2 text-chart-success text-[12px] font-semibold group-hover:gap-2 transition-all">
                <span>Leverage This Trend</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {chartError ? (
          <CardErrorState onRetry={() => setChartError(false)} />
        ) : (
          <DAUChart />
        )}
        <TopDropOffPages />
      </div>
    </DashboardLayout>
  );
};

function MetricCard({
  label,
  value,
  change,
  trend,
  icon,
  invertTrend = false,
}: {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "flat";
  icon: React.ReactNode;
  invertTrend?: boolean;
}) {
  const isPositive = invertTrend
    ? trend === "down"
    : trend === "up";

  return (
    <div className="asana-card p-4 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-muted-foreground">{label}</span>
        <div className="h-7 w-7 rounded-lg bg-accent flex items-center justify-center text-muted-foreground">
          {icon}
        </div>
      </div>
      <p className="text-[28px] font-bold text-foreground leading-none tracking-tight mt-1">{value}</p>
      <p className={`text-[12px] font-medium mt-1 ${isPositive ? "text-chart-success" : "text-destructive"}`}>
        {change} <span className="text-muted-foreground font-normal">vs. prior period</span>
      </p>
    </div>
  );
}

export default Index;
