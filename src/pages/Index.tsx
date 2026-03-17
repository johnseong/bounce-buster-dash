import { useState } from "react";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { DAUChart } from "@/components/DAUChart";
import { TopDropOffPages } from "@/components/TopDropOffPages";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const Index = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 14),
    to: new Date(),
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Sticky top bar */}
          <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border h-14 px-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div>
                <h1 className="text-sm font-semibold tracking-tight text-foreground">Activity Dashboard</h1>
                <p className="text-[11px] text-muted-foreground leading-tight">Identify and fix your highest drop-off pages</p>
              </div>
            </div>
            <DateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} />
          </header>

          {/* Content */}
          <div className="flex-1 p-6 space-y-5 bg-background">
            {/* KPI row */}
            <div className="grid grid-cols-3 gap-4">
              <KPICard label="Bounce Rate" value="60%" change="-2.4%" positive />
              <KPICard label="Avg. Session" value="1m 42s" change="+8s" positive />
              <KPICard label="DAU" value="2,050" change="+12%" positive />
            </div>
            <DAUChart />
            <TopDropOffPages />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

function KPICard({ label, value, change, positive }: { label: string; value: string; change: string; positive: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold text-foreground mt-1 tracking-tight">{value}</p>
      <p className={`text-xs mt-1 font-medium ${positive ? "text-emerald-600" : "text-destructive"}`}>
        {change} vs. prior period
      </p>
    </div>
  );
}

export default Index;
