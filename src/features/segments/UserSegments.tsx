/**
 * UserSegments — Displays audience cohort cards and demographic breakdown.
 *
 * Sections:
 *  1. Segment cards showing bounce rate and avg session per cohort
 *  2. Age demographics horizontal bar chart
 */

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Users, Smartphone, Monitor, Globe, Zap } from "lucide-react";
import { segments, demographics } from "./data/segmentsData";

const iconMap = { zap: Zap, smartphone: Smartphone, monitor: Monitor, globe: Globe, users: Users };

export default function UserSegments() {
  return (
    <DashboardLayout title="User Segments">
      <h2 className="text-[20px] font-bold text-foreground">User Segments</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {segments.map((seg) => {
          const Icon = iconMap[seg.iconKey];
          return (
            <div key={seg.name} className="asana-card p-5 space-y-4 hover:border-primary/30 transition-colors cursor-pointer">
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
