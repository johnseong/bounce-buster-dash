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
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <div className="p-6 pb-4">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">Top Drop-off Pages</h2>
        <p className="text-xs text-muted-foreground mt-1">Pages with the highest bounce rates this period</p>
      </div>
      <div className="px-6 pb-2">
        <div className="grid grid-cols-[1fr_100px_80px_90px] gap-4 text-[11px] font-medium text-muted-foreground uppercase tracking-wider pb-3 border-b border-border">
          <span>Page</span>
          <span>Bounce Rate</span>
          <span>Sessions</span>
          <span></span>
        </div>
      </div>
      <div className="px-6 pb-4">
        {dropOffPages.map((page) => (
          <div
            key={page.path}
            className="grid grid-cols-[1fr_100px_80px_90px] gap-4 items-center py-3 border-b border-border last:border-0 transition-colors hover:bg-accent/50"
          >
            <span className="text-sm font-medium text-foreground truncate">{page.path}</span>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-destructive transition-all"
                  style={{ width: `${page.bounceRate}%` }}
                />
              </div>
              <span className="text-xs font-medium text-destructive min-w-[32px]">{page.bounceRate}%</span>
            </div>
            <span className="text-xs text-muted-foreground">{page.sessions.toLocaleString()}</span>
            <Button variant="ghost" size="sm" className="text-xs h-7 text-muted-foreground hover:text-foreground">
              Details <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
