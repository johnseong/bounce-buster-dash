import { DashboardLayout } from "@/components/DashboardLayout";
import { Users, Smartphone, Monitor, Globe, Zap } from "lucide-react";

const segments = [
  { name: "Power Users", icon: Zap, count: 1240, bounce: "18%", avgSession: "8m 32s", color: "text-primary bg-primary/10" },
  { name: "Mobile Visitors", icon: Smartphone, count: 5680, bounce: "72%", avgSession: "0m 48s", color: "text-orange-500 bg-orange-500/10" },
  { name: "Desktop Users", icon: Monitor, count: 3420, bounce: "45%", avgSession: "3m 12s", color: "text-emerald-500 bg-emerald-500/10" },
  { name: "International", icon: Globe, count: 2150, bounce: "65%", avgSession: "1m 05s", color: "text-violet-500 bg-violet-500/10" },
  { name: "Returning Users", icon: Users, count: 890, bounce: "28%", avgSession: "5m 44s", color: "text-primary bg-primary/10" },
];

const demographics = [
  { label: "18–24", value: 22 },
  { label: "25–34", value: 38 },
  { label: "35–44", value: 24 },
  { label: "45–54", value: 11 },
  { label: "55+", value: 5 },
];

export default function Segments() {
  return (
    <DashboardLayout title="User Segments">
      {/* Segment cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {segments.map((seg) => (
          <div key={seg.name} className="apple-card p-5 space-y-4 hover:shadow-apple-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${seg.color}`}>
                <seg.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-foreground">{seg.name}</p>
                <p className="text-[12px] text-muted-foreground">{seg.count.toLocaleString()} users</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground/60 font-medium">Bounce</p>
                <p className="text-[20px] font-semibold text-foreground">{seg.bounce}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground/60 font-medium">Avg. Session</p>
                <p className="text-[20px] font-semibold text-foreground">{seg.avgSession}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Age demographics */}
      <div className="apple-card p-6">
        <h2 className="text-[15px] font-semibold text-foreground mb-5">Age Demographics</h2>
        <div className="space-y-3">
          {demographics.map((d) => (
            <div key={d.label} className="flex items-center gap-4">
              <span className="text-[13px] text-muted-foreground w-12">{d.label}</span>
              <div className="flex-1 h-8 rounded-xl bg-muted/50 overflow-hidden">
                <div
                  className="h-full rounded-xl bg-gradient-to-r from-primary to-primary/60"
                  style={{ width: `${d.value}%` }}
                />
              </div>
              <span className="text-[13px] font-medium text-foreground w-10 text-right">{d.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
