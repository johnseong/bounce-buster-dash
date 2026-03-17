import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

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
    <div className="apple-card overflow-hidden">
      <div className="p-6 pb-0">
        <h2 className="text-[15px] font-semibold text-foreground">Top Drop-off Pages</h2>
        <p className="text-[13px] text-muted-foreground mt-0.5">Pages with the highest bounce rates this period</p>
      </div>
      <div className="mt-5">
        <div className="grid grid-cols-[1fr_140px_80px_70px] gap-3 px-6 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest pb-3">
          <span>Page</span>
          <span>Bounce Rate</span>
          <span>Sessions</span>
          <span></span>
        </div>
        <div className="border-t border-border/60">
          {dropOffPages.map((page) => (
            <div
              key={page.path}
              className="grid grid-cols-[1fr_140px_80px_70px] gap-3 items-center px-6 py-3.5 border-b border-border/40 last:border-0 transition-colors hover:bg-muted/40 cursor-pointer group"
            >
              <span className="text-[13px] font-medium text-foreground truncate">{page.path}</span>
              <div className="flex items-center gap-2.5">
                <div className="flex-1 h-[5px] rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${page.bounceRate}%`,
                      background: page.bounceRate > 65
                        ? "hsl(var(--destructive))"
                        : page.bounceRate > 50
                          ? "hsl(35, 92%, 55%)"
                          : "hsl(var(--chart-primary))",
                      opacity: 0.8,
                    }}
                  />
                </div>
                <span className="text-[12px] font-semibold text-foreground min-w-[28px] tabular-nums">{page.bounceRate}%</span>
              </div>
              <span className="text-[12px] text-muted-foreground tabular-nums">{page.sessions.toLocaleString()}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
