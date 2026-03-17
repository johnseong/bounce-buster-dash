import { useState } from "react";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { DAUChart } from "@/components/DAUChart";
import { TopDropOffPages } from "@/components/TopDropOffPages";

const Index = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 14),
    to: new Date(),
  });

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 flex flex-col">
        {/* Sticky top bar */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">Activity Dashboard</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Identify and fix your highest drop-off pages</p>
          </div>
          <DateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} />
        </header>

        {/* Content */}
        <div className="flex-1 p-8 space-y-6">
          <DAUChart />
          <TopDropOffPages />
        </div>
      </main>
    </div>
  );
};

export default Index;
