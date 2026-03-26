/**
 * Drop-off analysis mock data.
 * Defines the e-commerce funnel steps and key drop-off insights.
 */

export const funnelSteps = [
  { name: "Landing Page", visitors: 12480, dropOff: 0, rate: "100%" },
  { name: "Product View", visitors: 7890, dropOff: 4590, rate: "63.2%" },
  { name: "Add to Cart", visitors: 3240, dropOff: 4650, rate: "41.1%" },
  { name: "Checkout", visitors: 1860, dropOff: 1380, rate: "57.4%" },
  { name: "Purchase", visitors: 1120, dropOff: 740, rate: "60.2%" },
];

export const dropOffInsights = [
  { title: "Biggest Drop-off", desc: "Product View → Add to Cart loses 58.9% of users", severity: "high" as const },
  { title: "Checkout Friction", desc: "Payment page has 42.6% abandonment rate", severity: "medium" as const },
  { title: "Mobile Drop-off", desc: "Mobile users drop off 23% more than desktop", severity: "high" as const },
];
