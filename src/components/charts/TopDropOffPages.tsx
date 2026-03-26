/**
 * TopDropOffPages — Ranked list of pages with the highest bounce rates.
 * Displays colour-coded progress bars for quick visual scanning.
 */

import { ChevronRight } from "lucide-react";

const dropOffPages = [
  { path: "/pricing", bounceRate: 78, sessions: 3420 },
  { path: "/signup", bounceRate: 72, sessions: 2890 },
  { path: "/onboarding/step-2", bounceRate: 65, sessions: 2140 },
  { path: "/features", bounceRate: 58, sessions: 4210 },
  { path: "/docs/getting-started", bounceRate: 52, sessions: 1870 },
];

export function TopDropOffPages() {
  return (
    <div className="asana-card overflow-hidden">
      <div className="p-5 pb-3">
        <h2 className="text-[15px] font-semibold text-foreground">Top Drop-off Pages</h2>
        <p className="text-[12px] text-muted-foreground mt-0.5">Highest bounce rates this period</p>
      </div>
      <div>
        {dropOffPages.map((page) => (
          <div key={page.path} className="flex items-center justify-between px-5 py-3 border-t border-border hover:bg-muted/40 transition-colors cursor-pointer group">
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-foreground truncate">{page.path}</p>
              <p className="text-[11px] text-muted-foreground">{page.sessions.toLocaleString()} sessions</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 w-28">
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${page.bounceRate}%`, backgroundColor: page.bounceRate > 65 ? "hsl(var(--chart-alert))" : page.bounceRate > 50 ? "hsl(var(--chart-warning))" : "hsl(var(--chart-primary))" }} />
                </div>
                <span className="text-[12px] font-semibold text-foreground tabular-nums w-8 text-right">{page.bounceRate}%</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
