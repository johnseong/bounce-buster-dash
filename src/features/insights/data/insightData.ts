/**
 * Performance insight detail mock data — weekly comparison chart data,
 * root-cause contributors, and recommended actions.
 */

export const weeklyComparison = [
  { day: "Mon", thisWeek: 62, lastWeek: 54 },
  { day: "Tue", thisWeek: 58, lastWeek: 50 },
  { day: "Wed", thisWeek: 65, lastWeek: 53 },
  { day: "Thu", thisWeek: 61, lastWeek: 51 },
  { day: "Fri", thisWeek: 59, lastWeek: 52 },
  { day: "Sat", thisWeek: 55, lastWeek: 48 },
  { day: "Sun", thisWeek: 60, lastWeek: 55 },
];

export const contributors = [
  {
    iconKey: "smartphone" as const,
    label: "Mobile bounce rate surged to 72%",
    detail: "Up from 58% last week. Mobile visitors leave after 48 seconds on average.",
    severity: "high" as const,
  },
  {
    iconKey: "shopping-cart" as const,
    label: "Checkout funnel lost 740 extra users",
    detail: "The 'Add to Cart → Checkout' step dropped from 57% to 41% conversion.",
    severity: "high" as const,
  },
  {
    iconKey: "monitor" as const,
    label: "Desktop performance held steady",
    detail: "Desktop bounce rate stayed at 45%, avg session 3m 12s. No action needed.",
    severity: "ok" as const,
  },
];

export const insightRecommendations = [
  {
    title: "Optimize mobile landing page",
    description: "Reduce page load time and simplify above-the-fold content for mobile visitors.",
    impact: "Could reduce mobile bounce by ~20%",
    primary: true,
  },
  {
    title: "Simplify checkout flow",
    description: "Remove the address confirmation step — 38% of users abandon there.",
    impact: "Could recover ~300 weekly conversions",
    primary: false,
  },
  {
    title: "Add exit-intent popup on product pages",
    description: "Show a discount or value proposition when users move to close the tab.",
    impact: "Could retain 5-10% of bouncing users",
    primary: false,
  },
];
