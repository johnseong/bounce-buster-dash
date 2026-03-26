/**
 * MetricCard — Displays a single KPI metric with trend indicator.
 * Used on the dashboard overview for at-a-glance performance metrics.
 */

import { Eye, TrendingDown, Clock, MousePointerClick } from "lucide-react";

/** Maps metric labels to their respective icons. */
const iconMap: Record<string, React.ReactNode> = {
  "Total Sessions": <Eye className="h-4 w-4" />,
  "Bounce Rate": <TrendingDown className="h-4 w-4" />,
  "Avg. Session": <Clock className="h-4 w-4" />,
  "Conversion Rate": <MousePointerClick className="h-4 w-4" />,
};

interface MetricCardProps {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "flat";
  invertTrend?: boolean;
}

export function MetricCard({ label, value, change, trend, invertTrend = false }: MetricCardProps) {
  const isPositive = invertTrend ? trend === "down" : trend === "up";

  return (
    <div className="asana-card p-4 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-muted-foreground">{label}</span>
        <div className="h-7 w-7 rounded-lg bg-accent flex items-center justify-center text-muted-foreground">
          {iconMap[label] ?? <Eye className="h-4 w-4" />}
        </div>
      </div>
      <p className="text-[28px] font-bold text-foreground leading-none tracking-tight mt-1">{value}</p>
      <p className={`text-[12px] font-medium mt-1 ${isPositive ? "text-chart-success" : "text-destructive"}`}>
        {change} <span className="text-muted-foreground font-normal">vs. prior period</span>
      </p>
    </div>
  );
}
