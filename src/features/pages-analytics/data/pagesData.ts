/**
 * Page performance mock data — per-page analytics metrics.
 */

export const pages = [
  { path: "/", title: "Homepage", views: 18420, bounceRate: 42, avgTime: "2m 18s", trend: "up" as const },
  { path: "/pricing", title: "Pricing", views: 8930, bounceRate: 38, avgTime: "3m 05s", trend: "up" as const },
  { path: "/blog", title: "Blog", views: 7540, bounceRate: 68, avgTime: "1m 12s", trend: "down" as const },
  { path: "/docs", title: "Documentation", views: 6210, bounceRate: 25, avgTime: "5m 44s", trend: "up" as const },
  { path: "/about", title: "About Us", views: 3890, bounceRate: 55, avgTime: "1m 30s", trend: "down" as const },
  { path: "/contact", title: "Contact", views: 2740, bounceRate: 72, avgTime: "0m 45s", trend: "down" as const },
  { path: "/features", title: "Features", views: 5120, bounceRate: 34, avgTime: "2m 50s", trend: "up" as const },
  { path: "/careers", title: "Careers", views: 1890, bounceRate: 48, avgTime: "2m 10s", trend: "up" as const },
];
