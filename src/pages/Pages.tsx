import { DashboardLayout } from "@/components/DashboardLayout";
import { ExternalLink, ArrowUpRight, ArrowDownRight } from "lucide-react";

const pages = [
  { path: "/", title: "Homepage", views: 18420, bounceRate: 42, avgTime: "2m 18s", trend: "up" },
  { path: "/pricing", title: "Pricing", views: 8930, bounceRate: 38, avgTime: "3m 05s", trend: "up" },
  { path: "/blog", title: "Blog", views: 7540, bounceRate: 68, avgTime: "1m 12s", trend: "down" },
  { path: "/docs", title: "Documentation", views: 6210, bounceRate: 25, avgTime: "5m 44s", trend: "up" },
  { path: "/about", title: "About Us", views: 3890, bounceRate: 55, avgTime: "1m 30s", trend: "down" },
  { path: "/contact", title: "Contact", views: 2740, bounceRate: 72, avgTime: "0m 45s", trend: "down" },
  { path: "/features", title: "Features", views: 5120, bounceRate: 34, avgTime: "2m 50s", trend: "up" },
  { path: "/careers", title: "Careers", views: 1890, bounceRate: 48, avgTime: "2m 10s", trend: "up" },
];

export default function Pages() {
  return (
    <DashboardLayout title="Pages">
      <h2 className="text-[20px] font-bold text-foreground">Pages</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="asana-card p-5">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground/60 font-medium">Total Pages</p>
          <p className="text-[26px] font-bold text-foreground mt-1">{pages.length}</p>
        </div>
        <div className="asana-card p-5">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground/60 font-medium">Total Views</p>
          <p className="text-[26px] font-bold text-foreground mt-1">{pages.reduce((s, p) => s + p.views, 0).toLocaleString()}</p>
        </div>
        <div className="asana-card p-5">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground/60 font-medium">Avg. Bounce Rate</p>
          <p className="text-[26px] font-bold text-foreground mt-1">{Math.round(pages.reduce((s, p) => s + p.bounceRate, 0) / pages.length)}%</p>
        </div>
      </div>

      <div className="asana-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="text-[15px] font-semibold text-foreground">All Pages</h3>
        </div>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left font-medium px-5 py-3">Page</th>
              <th className="text-right font-medium px-5 py-3">Views</th>
              <th className="text-right font-medium px-5 py-3">Bounce Rate</th>
              <th className="text-right font-medium px-5 py-3">Avg. Time</th>
              <th className="text-right font-medium px-5 py-3">Trend</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.path} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/50" />
                    <div>
                      <p className="font-medium text-foreground">{page.title}</p>
                      <p className="text-[12px] text-muted-foreground">{page.path}</p>
                    </div>
                  </div>
                </td>
                <td className="text-right px-5 py-3.5 text-muted-foreground">{page.views.toLocaleString()}</td>
                <td className="text-right px-5 py-3.5">
                  <span className={`font-medium ${page.bounceRate > 60 ? "text-destructive" : page.bounceRate > 45 ? "text-chart-warning" : "text-chart-success"}`}>
                    {page.bounceRate}%
                  </span>
                </td>
                <td className="text-right px-5 py-3.5 text-muted-foreground">{page.avgTime}</td>
                <td className="text-right px-5 py-3.5">
                  {page.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4 text-chart-success ml-auto" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-destructive ml-auto" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
