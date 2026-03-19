import { DashboardLayout } from "@/components/DashboardLayout";
import { TrendingDown, ArrowDown, MousePointerClick } from "lucide-react";

const funnelSteps = [
  { name: "Landing Page", visitors: 12480, dropOff: 0, rate: "100%" },
  { name: "Product View", visitors: 7890, dropOff: 4590, rate: "63.2%" },
  { name: "Add to Cart", visitors: 3240, dropOff: 4650, rate: "41.1%" },
  { name: "Checkout", visitors: 1860, dropOff: 1380, rate: "57.4%" },
  { name: "Purchase", visitors: 1120, dropOff: 740, rate: "60.2%" },
];

const insights = [
  { icon: MousePointerClick, title: "Biggest Drop-off", desc: "Product View → Add to Cart loses 58.9% of users", severity: "high" },
  { icon: ArrowDown, title: "Checkout Friction", desc: "Payment page has 42.6% abandonment rate", severity: "medium" },
  { icon: TrendingDown, title: "Mobile Drop-off", desc: "Mobile users drop off 23% more than desktop", severity: "high" },
];

export default function DropOff() {
  return (
    <DashboardLayout title="Drop-off Analysis">
      <h2 className="text-[20px] font-bold text-foreground">Drop-off Analysis</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight) => (
          <div key={insight.title} className="asana-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${insight.severity === "high" ? "bg-destructive/10 text-destructive" : "bg-chart-warning/10 text-chart-warning"}`}>
                <insight.icon className="h-4 w-4" />
              </div>
              <p className="text-[13px] font-semibold text-foreground">{insight.title}</p>
            </div>
            <p className="text-[13px] text-muted-foreground">{insight.desc}</p>
          </div>
        ))}
      </div>

      <div className="asana-card p-6">
        <h3 className="text-[15px] font-semibold text-foreground mb-5">Conversion Funnel</h3>
        <div className="space-y-1">
          {funnelSteps.map((step, i) => {
            const widthPercent = (step.visitors / funnelSteps[0].visitors) * 100;
            return (
              <div key={step.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13px] font-medium text-foreground">{step.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] text-muted-foreground">{step.visitors.toLocaleString()}</span>
                    {i > 0 && <span className="text-[12px] font-medium text-destructive">-{step.dropOff.toLocaleString()}</span>}
                  </div>
                </div>
                <div className="h-9 rounded-lg bg-muted/50 overflow-hidden">
                  <div className="h-full rounded-lg bg-primary/80 transition-all duration-700" style={{ width: `${widthPercent}%` }} />
                </div>
                {i < funnelSteps.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/40" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="asana-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="text-[15px] font-semibold text-foreground">Step-by-Step Breakdown</h3>
        </div>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left font-medium px-5 py-3">Step</th>
              <th className="text-right font-medium px-5 py-3">Visitors</th>
              <th className="text-right font-medium px-5 py-3">Drop-off</th>
              <th className="text-right font-medium px-5 py-3">Retention</th>
            </tr>
          </thead>
          <tbody>
            {funnelSteps.map((step, i) => (
              <tr key={step.name} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3 font-medium text-foreground flex items-center gap-2">
                  <span className="h-5 w-5 rounded bg-accent text-accent-foreground text-[11px] flex items-center justify-center font-semibold">{i + 1}</span>
                  {step.name}
                </td>
                <td className="text-right px-5 py-3 text-muted-foreground">{step.visitors.toLocaleString()}</td>
                <td className="text-right px-5 py-3 text-destructive font-medium">{i > 0 ? `-${step.dropOff.toLocaleString()}` : "—"}</td>
                <td className="text-right px-5 py-3 text-foreground font-medium">{step.rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
