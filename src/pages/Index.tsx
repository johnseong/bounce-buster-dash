import { useState } from "react";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { DAUChart } from "@/components/DAUChart";
import { TopDropOffPages } from "@/components/TopDropOffPages";
import { TrendingDown, Clock, Users } from "lucide-react";

const Index = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 14),
    to: new Date(),
  });

  return (
    <DashboardLayout title="Activity Dashboard">
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
      <DAUChart />
      <TopDropOffPages />
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
    <div className="apple-card p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
          {icon}
        </div>
        <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
      </div>
      <div>
        <p className="text-[28px] font-semibold text-foreground leading-none tracking-tight">{value}</p>
        <p className={`text-[13px] mt-1.5 font-medium ${positive ? "text-emerald-500" : "text-destructive"}`}>
          {change} <span className="text-muted-foreground font-normal">vs. prior period</span>
        </p>
      </div>
    </div>
  );
}

export default Index;
