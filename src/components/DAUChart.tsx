import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const data = [
  { date: "Mar 1", dau: 1240 },
  { date: "Mar 2", dau: 1380 },
  { date: "Mar 3", dau: 1190 },
  { date: "Mar 4", dau: 1420 },
  { date: "Mar 5", dau: 1560 },
  { date: "Mar 6", dau: 1340 },
  { date: "Mar 7", dau: 1680 },
  { date: "Mar 8", dau: 1520 },
  { date: "Mar 9", dau: 1750 },
  { date: "Mar 10", dau: 1630 },
  { date: "Mar 11", dau: 1890 },
  { date: "Mar 12", dau: 1710 },
  { date: "Mar 13", dau: 1980 },
  { date: "Mar 14", dau: 2050 },
];

export function DAUChart() {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="mb-5">
        <h2 className="text-[13px] font-semibold text-foreground">Daily Active Users</h2>
        <p className="text-[11px] text-muted-foreground mt-0.5">Engagement trend over the selected period</p>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="dauGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-primary))" stopOpacity={0.12} />
                <stop offset="100%" stopColor="hsl(var(--chart-primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)",
              }}
            />
            <Area
              type="monotone"
              dataKey="dau"
              stroke="hsl(var(--chart-primary))"
              strokeWidth={2}
              fill="url(#dauGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
