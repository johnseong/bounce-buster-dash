import { useState } from "react";
import { format } from "date-fns";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DAUChart } from "@/components/DAUChart";
import { TopDropOffPages } from "@/components/TopDropOffPages";
import { TrendingDown, Clock, Users, CheckCircle2, Sparkles } from "lucide-react";

const Index = () => {
  const today = new Date();
  const dayName = format(today, "EEEE, MMMM d");

  return (
    <DashboardLayout title="Home">
      {/* Hero greeting banner */}
      <div className="hero-banner rounded-2xl p-8 text-foreground">
        <p className="text-[13px] font-medium opacity-80">{dayName}</p>
        <h1 className="text-[28px] font-bold mt-1">Good afternoon, Alex</h1>
        <div className="flex items-center gap-6 mt-4 text-[13px] font-medium">
          <div className="flex items-center gap-1.5 opacity-80">
            <CheckCircle2 className="h-4 w-4" />
            <span>0 tasks completed</span>
          </div>
          <div className="flex items-center gap-1.5 opacity-80">
            <Users className="h-4 w-4" />
            <span>2 collaborators</span>
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
