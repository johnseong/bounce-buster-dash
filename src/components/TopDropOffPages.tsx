import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const dropOffPages = [
  { path: "/pricing", bounceRate: 78, sessions: 3420 },
  { path: "/signup", bounceRate: 72, sessions: 2890 },
  { path: "/onboarding/step-2", bounceRate: 65, sessions: 2140 },
  { path: "/features", bounceRate: 58, sessions: 4210 },
  { path: "/docs/getting-started", bounceRate: 52, sessions: 1870 },
  { path: "/blog/announcement", bounceRate: 48, sessions: 1540 },
  { path: "/integrations", bounceRate: 44, sessions: 1320 },
];

export function TopDropOffPages() {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="p-5 pb-0">
        <h2 className="text-[13px] font-semibold text-foreground">Top Drop-off Pages</h2>
        <p className="text-[11px] text-muted-foreground mt-0.5">Pages with the highest bounce rates this period</p>
      </div>
      <div className="mt-4">
        <div className="grid grid-cols-[1fr_120px_80px_80px] gap-3 px-5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider pb-2.5 border-b border-border">
          <span>Page</span>
          <span>Bounce Rate</span>
          <span>Sessions</span>
          <span></span>
        </div>
        {dropOffPages.map((page, i) => (
          <div
            key={page.path}
            className="grid grid-cols-[1fr_120px_80px_80px] gap-3 items-center px-5 py-3 border-b border-border last:border-0 transition-colors hover:bg-muted/50"
          >
            <span className="text-[13px] font-medium text-foreground truncate font-mono">{page.path}</span>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-destructive/80 transition-all"
                  style={{ width: `${page.bounceRate}%` }}
                />
              </div>
              <span className="text-[11px] font-semibold text-destructive min-w-[28px] tabular-nums">{page.bounceRate}%</span>
            </div>
            <span className="text-[11px] text-muted-foreground tabular-nums">{page.sessions.toLocaleString()}</span>
            <Button variant="ghost" size="sm" className="text-[11px] h-7 px-2 text-muted-foreground hover:text-foreground">
              Details <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
