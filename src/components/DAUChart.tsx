import {
  LineChart,
  Line,
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
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">Daily Active Users</h2>
        <p className="text-xs text-muted-foreground mt-1">User engagement over the selected period</p>
      </div>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="dauGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(239 84% 67%)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="hsl(239 84% 67%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "hsl(215 16% 47%)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(215 16% 47%)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0 0% 100%)",
                border: "1px solid hsl(214 32% 91%)",
                borderRadius: "8px",
                fontSize: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            />
            <Area
              type="monotone"
              dataKey="dau"
              stroke="hsl(239 84% 67%)"
              strokeWidth={2.5}
              fill="url(#dauGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
