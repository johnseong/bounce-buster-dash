/**
 * Funnel list mock data — multiple conversion funnels with step breakdowns.
 */

export const funnels = [
  {
    name: "Signup Flow", conversion: 24.8, trend: "up" as const,
    steps: [
      { name: "Landing", value: 10000 },
      { name: "Signup Form", value: 5200 },
      { name: "Email Verify", value: 3800 },
      { name: "Onboarding", value: 2480 },
    ],
  },
  {
    name: "Purchase Flow", conversion: 8.9, trend: "down" as const,
    steps: [
      { name: "Product Page", value: 8500 },
      { name: "Add to Cart", value: 2800 },
      { name: "Checkout", value: 1200 },
      { name: "Payment", value: 756 },
    ],
  },
  {
    name: "Feature Adoption", conversion: 35.2, trend: "up" as const,
    steps: [
      { name: "Dashboard", value: 4200 },
      { name: "Feature Discovery", value: 2800 },
      { name: "First Use", value: 1950 },
      { name: "Repeated Use", value: 1478 },
    ],
  },
];
