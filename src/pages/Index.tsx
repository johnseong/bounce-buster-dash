import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DAUChart } from "@/components/DAUChart";
import { TopDropOffPages } from "@/components/TopDropOffPages";
import { InsightCardSkeleton, KPICardSkeleton, ChartSkeleton, TableSkeleton } from "@/components/CardSkeleton";
import { CardErrorState } from "@/components/CardErrorState";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { InsightCardSkeleton, KPICardSkeleton, ChartSkeleton, TableSkeleton } from "@/components/CardSkeleton";
import { CardEmptyState } from "@/components/CardEmptyState";
import { CardErrorState } from "@/components/CardErrorState";
import {
  TrendingDown,
  Clock,
  Users,
  ArrowRight,
  AlertTriangle,
  Zap,
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
        <InsightCardSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InsightCardSkeleton />
          <InsightCardSkeleton />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <KPICardSkeleton />
          <KPICardSkeleton />
          <KPICardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ChartSkeleton />
          <TableSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Home">
      {/* Primary Insight */}
      <div
        className="asana-card p-6 border-l-4 border-l-destructive cursor-pointer hover:shadow-md transition-shadow group"
        onClick={() => navigate("/insight/performance-drop")}
      >
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-xl bg-destructive/15 flex items-center justify-center shrink-0">
            <TrendingDown className="h-7 w-7 text-destructive" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-destructive/10 text-[11px] uppercase tracking-wider font-bold text-destructive">
                <AlertTriangle className="h-3 w-3" /> Critical
              </span>
              <span className="text-[11px] text-muted-foreground">• 2 hours ago</span>
            </div>
            <h2 className="text-[20px] font-bold text-foreground leading-snug">
              Performance dropped 15% — mobile bounce rate surged to 72%
            </h2>
            <p className="text-[14px] text-muted-foreground mt-1.5 leading-relaxed">
              Mobile visitors leave after 48s on average. The checkout funnel lost 740 users at the "Add to Cart → Checkout" step, 
              where conversion fell from 57% to 41%.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <Button size="sm" variant="destructive" className="rounded-lg text-[13px] h-9 gap-1.5 group-hover:gap-2.5 transition-all font-semibold">
                Fix Checkout Drop-off
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" variant="outline" className="rounded-lg text-[13px] h-9 gap-1.5" onClick={(e) => { e.stopPropagation(); navigate("/insight/performance-drop"); }}>
                Analyze Root Cause
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="asana-card p-5 border-l-4 border-l-chart-warning cursor-pointer hover:shadow-md transition-shadow group"
          onClick={() => navigate("/insight/performance-drop")}
        >
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-chart-warning/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-chart-warning" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-bold text-foreground">Mobile landing page loads in 4.2s — 72% bounce</p>
              <p className="text-[12px] text-muted-foreground mt-1">
                Slow load time on mobile is the #1 driver. Desktop loads in 1.8s with only 45% bounce.
              </p>
              <div className="flex items-center gap-1 mt-2.5 text-chart-warning text-[12px] font-semibold group-hover:gap-2 transition-all">
                <span>Optimize Mobile Speed</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>

        <div
          className="asana-card p-5 border-l-4 border-l-chart-success cursor-pointer hover:shadow-md transition-shadow group"
          onClick={() => navigate("/insight/performance-drop")}
        >
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-chart-success/10 flex items-center justify-center shrink-0">
              <Zap className="h-5 w-5 text-chart-success" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-bold text-foreground">Docs engagement up 25% — avg session 5m 44s</p>
              <p className="text-[12px] text-muted-foreground mt-1">
                Users who visit Docs convert 3× more. Consider promoting it in onboarding.
              </p>
              <div className="flex items-center gap-1 mt-2.5 text-chart-success text-[12px] font-semibold group-hover:gap-2 transition-all">
                <span>Leverage This Trend</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-3 gap-4">
        <KPICard icon={<TrendingDown className="h-4 w-4" />} label="Bounce Rate" value="60%" change="-2.4%" positive />
        <KPICard icon={<Clock className="h-4 w-4" />} label="Avg. Session" value="1m 42s" change="+8s" positive />
        <KPICard icon={<Users className="h-4 w-4" />} label="Daily Active Users" value="2,050" change="+12%" positive />
      </div>

      {/* Charts + Table — one with error demo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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

function KPICard({
  icon,
  label,
  value,
  change,
  positive,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  positive: boolean;
}) {
  return (
    <div className="asana-card p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center text-accent-foreground">
          {icon}
        </div>
        <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
      </div>
      <div>
        <p className="text-[26px] font-bold text-foreground leading-none">{value}</p>
        <p className={`text-[13px] mt-1.5 font-medium ${positive ? "text-chart-success" : "text-destructive"}`}>
          {change} <span className="text-muted-foreground font-normal">vs. prior period</span>
        </p>
      </div>
    </div>
  );
}

export default Index;
