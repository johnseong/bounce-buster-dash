/**
 * UserSegments — Displays audience cohort cards and demographic breakdown.
 * Now powered by live data from user_segments table.
 *
 * Sections:
 *  1. Segment cards showing bounce rate and avg session per cohort
 *  2. Age demographics horizontal bar chart (still static — no demographics table)
 */

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Users, Smartphone, Monitor, Globe, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CardEmptyState } from "@/components/feedback/CardEmptyState";
import { CardErrorState } from "@/components/feedback/CardErrorState";
import { useSegments } from "@/hooks/useSegments";
import { demographics } from "./data/segmentsData";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  zap: Zap, smartphone: Smartphone, monitor: Monitor, globe: Globe, users: Users,
};

export default function UserSegments() {
  const { data: segments, isLoading, isError, refetch } = useSegments();

  return (
    <DashboardLayout title="User Segments">
      <h2 className="text-[20px] font-bold text-foreground">User Segments</h2>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="asana-card p-5 space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <div className="flex gap-6">
                <Skeleton className="h-7 w-14" />
                <Skeleton className="h-7 w-14" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <CardErrorState
          title="Failed to load segments"
          message="Couldn't load segment data — please try again."
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && (!segments || segments.length === 0) && (
        <CardEmptyState title="No segments yet" message="Create a segment to start grouping your users." />
      )}

      {!isLoading && !isError && segments && segments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {segments.map((seg) => {
            const Icon = iconMap[seg.iconKey] || Users;
            return (
              <div key={seg.id} className="asana-card p-5 space-y-4 hover:border-primary/30 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${seg.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-foreground">{seg.name}</p>
                    <p className="text-[12px] text-muted-foreground">{seg.count.toLocaleString()} users</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground/60 font-medium">Bounce</p>
                    <p className="text-[20px] font-bold text-foreground">{seg.bounce}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground/60 font-medium">Avg. Session</p>
                    <p className="text-[20px] font-bold text-foreground">{seg.avgSession}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="asana-card p-6">
        <h3 className="text-[15px] font-semibold text-foreground mb-5">Age Demographics</h3>
        <div className="space-y-3">
          {demographics.map((d) => (
            <div key={d.label} className="flex items-center gap-4">
              <span className="text-[13px] text-muted-foreground w-12">{d.label}</span>
              <div className="flex-1 h-7 rounded-lg bg-muted/50 overflow-hidden">
                <div className="h-full rounded-lg bg-primary/70" style={{ width: `${d.value}%` }} />
              </div>
              <span className="text-[13px] font-semibold text-foreground w-10 text-right">{d.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
