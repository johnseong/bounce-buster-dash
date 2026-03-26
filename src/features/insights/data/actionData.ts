/**
 * Action result mock data — optimisation steps and projected impact metrics
 * for the "Optimize mobile landing page" recommended fix.
 */

export const actionSteps = [
  {
    title: "Enable mobile-optimized landing page",
    description: "Switches visitors on screens < 768px to a simplified layout with faster load time.",
  },
  {
    title: "Lazy-load below-the-fold images",
    description: "Defer loading of product gallery images until the user scrolls down.",
  },
  {
    title: "Reduce hero section to single CTA",
    description: "Replace the 3-button hero with a single, clear call-to-action for mobile.",
  },
];

export const expectedResults = [
  { label: "Mobile bounce rate", current: "72%", projected: "~55%", iconKey: "smartphone" as const },
  { label: "Page load time", current: "4.2s", projected: "~1.8s", iconKey: "clock" as const },
  { label: "Weekly conversions", current: "1,120", projected: "~1,420", iconKey: "trending-up" as const },
];
