/**
 * Funnel detail analysis mock data — step-level metrics, segment breakdown,
 * and AI-generated recommendations for the Signup Flow funnel.
 */

export const funnelSteps = [
  { name: "Landing Page", users: 10000, conversion: 100, dropOff: 0 },
  { name: "Signup Form", users: 5200, conversion: 52, dropOff: 48 },
  { name: "Email Verification", users: 3800, conversion: 73.1, dropOff: 26.9 },
  { name: "Onboarding", users: 2480, conversion: 65.3, dropOff: 34.7 },
  { name: "First Action", users: 1860, conversion: 75, dropOff: 25 },
];

export const segmentData = [
  { segment: "Organic Search", landing: 4200, signup: 2310, verified: 1764, onboarded: 1210, firstAction: 968, convRate: 23.0 },
  { segment: "Paid Ads", landing: 3100, signup: 1488, verified: 950, onboarded: 570, firstAction: 370, convRate: 11.9 },
  { segment: "Direct Traffic", landing: 1800, signup: 936, verified: 748, onboarded: 486, firstAction: 365, convRate: 20.3 },
  { segment: "Social Media", landing: 900, signup: 466, verified: 338, onboarded: 214, firstAction: 157, convRate: 17.4 },
];

export const recommendations = [
  {
    severity: "critical" as const,
    title: "Reduce signup form friction",
    description: "48% drop-off at signup. Simplify to email-only registration, add social login options.",
    impact: "+12% conversion",
  },
  {
    severity: "high" as const,
    title: "Improve email verification flow",
    description: "26.9% drop-off at verification. Add magic link option and resend prompt after 30s.",
    impact: "+8% conversion",
  },
  {
    severity: "medium" as const,
    title: "Optimize onboarding steps",
    description: "34.7% drop-off during onboarding. Reduce steps from 5 to 3, add skip option.",
    impact: "+15% conversion",
  },
  {
    severity: "low" as const,
    title: "Add progress indicators",
    description: "Show users how far they are in the flow. Increases completion by reducing uncertainty.",
    impact: "+5% conversion",
  },
];

export const severityConfig = {
  critical: { color: "bg-destructive/10 text-destructive border-destructive/20", label: "Critical" },
  high: { color: "bg-chart-warning/10 text-chart-warning border-chart-warning/20", label: "High" },
  medium: { color: "bg-primary/10 text-primary border-primary/20", label: "Medium" },
  low: { color: "bg-muted text-muted-foreground border-border", label: "Low" },
};
