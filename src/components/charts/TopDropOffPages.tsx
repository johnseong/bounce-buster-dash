/**
 * TopDropOffPages — Ranked list of pages with the highest bounce rates.
 * Now powered by live database queries via useTopDropOffPages hook.
 */

import { ChevronRight } from "lucide-react";
import { useTopDropOffPages } from "@/hooks/useDashboardData";
import { TableSkeleton } from "@/components/feedback/CardSkeleton";
import { CardErrorState } from "@/components/feedback/CardErrorState";
import { CardEmptyState } from "@/components/feedback/CardEmptyState";

export function TopDropOffPages() {
  const { data: dropOffPages, isLoading, isError, refetch } = useTopDropOffPages();

  if (isLoading) return <TableSkeleton />;
  if (isError) return <CardErrorState title="Drop-off data failed" onRetry={() => refetch()} />;
  if (!dropOffPages || dropOffPages.length === 0) return <CardEmptyState title="No page data yet" message="Page analytics will appear once traffic is recorded." />;

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
