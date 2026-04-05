/**
 * FunnelsList — Lists all tracked conversion funnels with mini bar previews.
 * Clicking a funnel navigates to its detailed analysis page.
 * Now powered by live data from saved_funnels + funnel_events.
 */

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ArrowRight, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFunnelsList } from "@/hooks/useFunnelsList";
import { Skeleton } from "@/components/ui/skeleton";
import { CardEmptyState } from "@/components/feedback/CardEmptyState";
import { CardErrorState } from "@/components/feedback/CardErrorState";

export default function FunnelsList() {
  const navigate = useNavigate();
  const { data: funnels, isLoading, isError, refetch } = useFunnelsList();

  return (
    <DashboardLayout title="Funnels">
      <h2 className="text-[20px] font-bold text-foreground">Funnels</h2>

      {isLoading && (
        <div className="space-y-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="asana-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-lg" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((j) => (
                  <Skeleton key={j} className="h-7 flex-1 rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <CardErrorState
          title="Failed to load funnels"
          message="Couldn't load funnel data — please try again."
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && (!funnels || funnels.length === 0) && (
        <CardEmptyState
          title="No funnels yet"
          message="Create a funnel to start tracking conversion steps."
        />
      )}

      {!isLoading && !isError && funnels && funnels.length > 0 && (
        <div className="space-y-5">
          {funnels.map((funnel) => (
            <div
              key={funnel.id}
              className="asana-card p-6 cursor-pointer hover:border-primary/30 transition-colors group"
              onClick={() => navigate("/funnels/detail")}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-foreground">{funnel.name}</h3>
                    <p className="text-[12px] text-muted-foreground">{funnel.steps.length} steps</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {funnel.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-chart-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                  <span className={`text-[20px] font-bold ${funnel.trend === "up" ? "text-chart-success" : "text-destructive"}`}>
                    {funnel.conversion}%
                  </span>
                  <span className="text-[12px] text-muted-foreground">conversion</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {funnel.steps.map((step, i) => {
                  const pct = funnel.steps[0].value > 0
                    ? (step.value / funnel.steps[0].value) * 100
                    : 0;
                  return (
                    <div key={step.name} className="flex items-center gap-2 flex-1">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[12px] font-medium text-foreground">{step.name}</span>
                          <span className="text-[11px] text-muted-foreground">{step.value.toLocaleString()}</span>
                        </div>
                        <div className="h-7 rounded-lg bg-muted/50 overflow-hidden">
                          <div className="h-full rounded-lg bg-primary/70 transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">{Math.round(pct)}%</p>
                      </div>
                      {i < funnel.steps.length - 1 && (
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
