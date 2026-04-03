/**
 * DailyActiveUsersChart — Area chart showing DAU over the last 14 days.
 * Now powered by live database queries via useDailyActiveUsers hook.
 */

import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { useDailyActiveUsers } from "@/hooks/useDashboardData";
import { ChartSkeleton } from "@/components/feedback/CardSkeleton";
import { CardErrorState } from "@/components/feedback/CardErrorState";
import { CardEmptyState } from "@/components/feedback/CardEmptyState";

export function DailyActiveUsersChart() {
  const { data, isLoading, isError, refetch } = useDailyActiveUsers();

  if (isLoading) return <ChartSkeleton />;
  if (isError) return <CardErrorState title="DAU chart failed" onRetry={() => refetch()} />;
  if (!data || data.length === 0) return <CardEmptyState title="No activity yet" message="Session data will appear here once analytics events are recorded." />;

  const latestDAU = data[data.length - 1]?.dau ?? 0;

  return (
    <div className="asana-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Daily Active Users</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">Last 14 days</p>
        </div>
        <span className="text-[22px] font-bold text-foreground tracking-tight">{latestDAU.toLocaleString()}</span>
      </div>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="dauGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-primary))" stopOpacity={0.15} />
                <stop offset="100%" stopColor="hsl(var(--chart-primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} dy={8} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "13px", fontWeight: 500, padding: "8px 12px" }} cursor={{ stroke: "hsl(var(--border))" }} />
            <Area type="monotone" dataKey="dau" stroke="hsl(var(--chart-primary))" strokeWidth={2} fill="url(#dauGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
