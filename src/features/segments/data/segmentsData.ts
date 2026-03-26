/**
 * User segment mock data — audience cohorts with engagement metrics.
 */

export const segments = [
  { name: "Power Users", iconKey: "zap" as const, count: 1240, bounce: "18%", avgSession: "8m 32s", color: "bg-accent text-accent-foreground" },
  { name: "Mobile Visitors", iconKey: "smartphone" as const, count: 5680, bounce: "72%", avgSession: "0m 48s", color: "bg-chart-warning/10 text-chart-warning" },
  { name: "Desktop Users", iconKey: "monitor" as const, count: 3420, bounce: "45%", avgSession: "3m 12s", color: "bg-chart-success/10 text-chart-success" },
  { name: "International", iconKey: "globe" as const, count: 2150, bounce: "65%", avgSession: "1m 05s", color: "bg-primary/10 text-primary" },
  { name: "Returning Users", iconKey: "users" as const, count: 890, bounce: "28%", avgSession: "5m 44s", color: "bg-accent text-accent-foreground" },
];

export const demographics = [
  { label: "18–24", value: 22 },
  { label: "25–34", value: 38 },
  { label: "35–44", value: 24 },
  { label: "45–54", value: 11 },
  { label: "55+", value: 5 },
];
