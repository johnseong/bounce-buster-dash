import { DashboardLayout } from "@/components/DashboardLayout";
import { ArrowRight, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

const funnels = [
  {
    name: "Signup Flow",
    conversion: 24.8,
    trend: "up",
    steps: [
      { name: "Landing", value: 10000 },
      { name: "Signup Form", value: 5200 },
      { name: "Email Verify", value: 3800 },
      { name: "Onboarding", value: 2480 },
    ],
  },
  {
    name: "Purchase Flow",
    conversion: 8.9,
    trend: "down",
    steps: [
      { name: "Product Page", value: 8500 },
      { name: "Add to Cart", value: 2800 },
      { name: "Checkout", value: 1200 },
      { name: "Payment", value: 756 },
    ],
  },
  {
    name: "Feature Adoption",
    conversion: 35.2,
    trend: "up",
    steps: [
      { name: "Dashboard", value: 4200 },
      { name: "Feature Discovery", value: 2800 },
      { name: "First Use", value: 1950 },
      { name: "Repeated Use", value: 1478 },
    ],
  },
];

export default function Funnels() {
  return (
    <DashboardLayout title="Funnels">
      <div className="space-y-5">
        {funnels.map((funnel) => (
          <div key={funnel.name} className="apple-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-[15px] font-semibold text-foreground">{funnel.name}</h2>
                  <p className="text-[12px] text-muted-foreground">{funnel.steps.length} steps</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {funnel.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
                <span className={`text-[20px] font-semibold ${funnel.trend === "up" ? "text-emerald-500" : "text-destructive"}`}>
                  {funnel.conversion}%
                </span>
                <span className="text-[12px] text-muted-foreground">conversion</span>
              </div>
            </div>

            {/* Funnel steps */}
            <div className="flex items-center gap-2">
              {funnel.steps.map((step, i) => {
                const pct = (step.value / funnel.steps[0].value) * 100;
                return (
                  <div key={step.name} className="flex items-center gap-2 flex-1">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[12px] font-medium text-foreground">{step.name}</span>
                        <span className="text-[11px] text-muted-foreground">{step.value.toLocaleString()}</span>
                      </div>
                      <div className="h-8 rounded-lg bg-muted/50 overflow-hidden">
                        <div
                          className="h-full rounded-lg bg-gradient-to-r from-primary to-primary/60 transition-all"
                          style={{ width: `${pct}%` }}
                        />
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
    </DashboardLayout>
  );
}
