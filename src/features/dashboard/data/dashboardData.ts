/**
 * Dashboard mock data — KPI metrics and sparkline trends.
 * In production, this would be fetched from an analytics API.
 */

export interface DashboardMetric {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "flat";
  invertTrend?: boolean;
}

/** Top-level KPI metrics displayed on the dashboard overview. */
export const dashboardMetrics: DashboardMetric[] = [
  { label: "Total Sessions", value: "79,842", change: "+12.4%", trend: "up" },
  { label: "Bounce Rate", value: "60%", change: "-2.4%", trend: "down", invertTrend: true },
  { label: "Avg. Session", value: "1m 42s", change: "+8s", trend: "up" },
  { label: "Conversion Rate", value: "4.27%", change: "+0.8%", trend: "up" },
];

/** Primary critical insight shown at the top of the dashboard. */
export const primaryInsight = {
  title: "Performance dropped 15% — mobile bounce rate surged to 72%",
  description:
    "Mobile visitors leave after 48s on average. The checkout funnel lost 740 users at the \"Add to Cart → Checkout\" step.",
  timeAgo: "2 hours ago",
};

/** Secondary insight cards displayed below the primary insight. */
export const secondaryInsights = [
  {
    type: "warning" as const,
    title: "Mobile landing page loads in 4.2s — 72% bounce",
    description: "Slow load time on mobile is the #1 driver. Desktop loads in 1.8s with only 45% bounce.",
    cta: "Optimize Mobile Speed",
  },
  {
    type: "success" as const,
    title: "Docs engagement up 25% — avg session 5m 44s",
    description: "Users who visit Docs convert 3× more. Consider promoting it in onboarding.",
    cta: "Leverage This Trend",
  },
];
