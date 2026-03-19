import { useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DAUChart } from "@/components/DAUChart";
import { TopDropOffPages } from "@/components/TopDropOffPages";
import {
  TrendingDown,
  Clock,
  Users,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const today = new Date();
  const dayName = format(today, "EEEE, MMMM d");
  const navigate = useNavigate();

  return (
    <DashboardLayout title="Home">
      {/* Hero greeting banner */}
      <div className="hero-banner rounded-2xl p-8 text-foreground">
        <p className="text-[13px] font-medium opacity-80">{dayName}</p>
        <h1 className="text-[28px] font-bold mt-1">Good afternoon, Alex</h1>
        <div className="flex items-center gap-6 mt-4 text-[13px] font-medium">
          <div className="flex items-center gap-1.5 opacity-80">
            <CheckCircle2 className="h-4 w-4" />
            <span>3 insights waiting</span>
          </div>
          <div className="flex items-center gap-1.5 opacity-80">
            <Users className="h-4 w-4" />
            <span>2,050 active users</span>
          </div>
        </div>
      </div>

      {/* Primary Insight Card — the hero of this prototype */}
      <div
        className="asana-card p-6 border-l-4 border-l-destructive cursor-pointer hover:shadow-md transition-shadow group"
        onClick={() => navigate("/insight/performance-drop")}
      >
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
            <TrendingDown className="h-6 w-6 text-destructive" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-destructive">Needs Attention</span>
              <span className="text-[11px] text-muted-foreground">• 2 hours ago</span>
            </div>
            <h2 className="text-[18px] font-bold text-foreground leading-snug">
              Your performance dropped by 15% this week
            </h2>
            <p className="text-[14px] text-muted-foreground mt-1.5 leading-relaxed">
              Bounce rate increased from 52% to 60%, driven by mobile visitors. 
              Your checkout funnel lost 740 more users than last week.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <Button size="sm" className="rounded-lg text-[13px] h-8 gap-1.5 group-hover:gap-2.5 transition-all">
                View Details
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
              <span className="text-[12px] text-muted-foreground">Click to understand why and take action</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary insights row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="asana-card p-5 cursor-pointer hover:shadow-md transition-shadow group"
          onClick={() => navigate("/insight/performance-drop")}
        >
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-chart-warning/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-chart-warning" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-foreground">Mobile users bounce 72% of the time</p>
              <p className="text-[12px] text-muted-foreground mt-1">
                That's 23% higher than desktop. Your mobile landing page may need attention.
              </p>
              <div className="flex items-center gap-1 mt-2 text-primary text-[12px] font-medium group-hover:gap-2 transition-all">
                <span>See breakdown</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>

        <div
          className="asana-card p-5 cursor-pointer hover:shadow-md transition-shadow group"
          onClick={() => navigate("/insight/performance-drop")}
        >
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-chart-success/10 flex items-center justify-center shrink-0">
              <Zap className="h-5 w-5 text-chart-success" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-foreground">You spent 25% more time on Docs this week</p>
              <p className="text-[12px] text-muted-foreground mt-1">
                Documentation page sessions grew to 5m 44s avg. Users find it valuable.
              </p>
              <div className="flex items-center gap-1 mt-2 text-primary text-[12px] font-medium group-hover:gap-2 transition-all">
                <span>See details</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-3 gap-4">
        <KPICard
          icon={<TrendingDown className="h-4 w-4" />}
          label="Bounce Rate"
          value="60%"
          change="-2.4%"
          positive
        />
        <KPICard
          icon={<Clock className="h-4 w-4" />}
          label="Avg. Session"
          value="1m 42s"
          change="+8s"
          positive
        />
        <KPICard
          icon={<Users className="h-4 w-4" />}
          label="Daily Active Users"
          value="2,050"
          change="+12%"
          positive
        />
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <DAUChart />
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
