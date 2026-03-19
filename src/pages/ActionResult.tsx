import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle2,
  Smartphone,
  Zap,
  Clock,
  TrendingUp,
  ArrowRight,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const actionSteps = [
  {
    title: "Enable mobile-optimized landing page",
    description: "Switches visitors on screens < 768px to a simplified layout with faster load time.",
    status: "ready" as const,
  },
  {
    title: "Lazy-load below-the-fold images",
    description: "Defer loading of product gallery images until the user scrolls down.",
    status: "ready" as const,
  },
  {
    title: "Reduce hero section to single CTA",
    description: "Replace the 3-button hero with a single, clear call-to-action for mobile.",
    status: "ready" as const,
  },
];

const expectedResults = [
  { label: "Mobile bounce rate", current: "72%", projected: "~55%", icon: Smartphone },
  { label: "Page load time", current: "4.2s", projected: "~1.8s", icon: Clock },
  { label: "Weekly conversions", current: "1,120", projected: "~1,420", icon: TrendingUp },
];

export default function ActionResult() {
  const navigate = useNavigate();
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  const handleApply = () => {
    setApplying(true);
    setTimeout(() => {
      setApplying(false);
      setApplied(true);
    }, 2000);
  };

  return (
    <DashboardLayout title="Take Action">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/insight/performance-drop")}
          className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Insight
        </button>
      </div>

      {!applied ? (
        <>
          {/* Action header */}
          <div className="asana-card p-6 border-l-4 border-l-primary">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-primary">Recommended Fix</span>
                <h1 className="text-[22px] font-bold text-foreground mt-1">
                  Optimize mobile landing page
                </h1>
                <p className="text-[14px] text-muted-foreground mt-2 leading-relaxed max-w-2xl">
                  This action will apply 3 optimizations to reduce mobile bounce rate. 
                  Based on similar sites, this could reduce your mobile bounce rate by approximately 20% and recover ~300 weekly conversions.
                </p>
              </div>
            </div>
          </div>

          {/* Expected Impact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {expectedResults.map((item) => (
              <div key={item.label} className="asana-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center text-accent-foreground">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <p className="text-[13px] font-medium text-muted-foreground">{item.label}</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[14px] text-muted-foreground line-through">{item.current}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[22px] font-bold text-chart-success">{item.projected}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Action steps */}
          <div className="asana-card p-6">
            <h2 className="text-[15px] font-semibold text-foreground mb-5">What will be changed</h2>
            <div className="space-y-3">
              {actionSteps.map((step, i) => (
                <div key={step.title} className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                  <span className="h-6 w-6 rounded-lg bg-primary/10 text-primary text-[12px] flex items-center justify-center font-bold shrink-0">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold text-foreground">{step.title}</p>
                    <p className="text-[13px] text-muted-foreground mt-0.5">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <Button
                className="rounded-lg text-[14px] h-10 gap-2 px-6"
                onClick={handleApply}
                disabled={applying}
              >
                {applying ? (
                  <>
                    <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Applying changes...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Apply All Changes
                  </>
                )}
              </Button>
              <Button variant="outline" className="rounded-lg text-[14px] h-10" onClick={() => navigate("/insight/performance-drop")}>
                Cancel
              </Button>
            </div>

            {applying && (
              <div className="mt-4">
                <Progress value={66} className="h-2 rounded-full" />
                <p className="text-[12px] text-muted-foreground mt-2">Applying optimizations to mobile landing page...</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Success state */}
          <div className="asana-card p-8 text-center">
            <div className="h-16 w-16 rounded-2xl bg-chart-success/10 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="h-8 w-8 text-chart-success" />
            </div>
            <h1 className="text-[24px] font-bold text-foreground">Changes Applied Successfully</h1>
            <p className="text-[14px] text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed">
              All 3 mobile optimizations are now live. You should start seeing improvements in 24–48 hours as data accumulates.
            </p>
          </div>

          {/* Projected impact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {expectedResults.map((item) => (
              <div key={item.label} className="asana-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-chart-success/10 flex items-center justify-center">
                    <item.icon className="h-4 w-4 text-chart-success" />
                  </div>
                  <p className="text-[13px] font-medium text-muted-foreground">{item.label}</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[14px] text-muted-foreground line-through">{item.current}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[22px] font-bold text-chart-success">{item.projected}</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1.5">Expected within 7 days</p>
              </div>
            ))}
          </div>

          {/* What changed */}
          <div className="asana-card p-6">
            <h2 className="text-[15px] font-semibold text-foreground mb-4">Changes Made</h2>
            <div className="space-y-3">
              {actionSteps.map((step) => (
                <div key={step.title} className="flex items-center gap-3 p-3 rounded-xl bg-chart-success/5 border border-chart-success/20">
                  <CheckCircle2 className="h-5 w-5 text-chart-success shrink-0" />
                  <div>
                    <p className="text-[13px] font-medium text-foreground">{step.title}</p>
                    <p className="text-[12px] text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next steps */}
          <div className="asana-card p-6">
            <h2 className="text-[15px] font-semibold text-foreground mb-4">What's Next</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
                <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-[14px] font-medium text-foreground">Monitor results for 7 days</p>
                  <p className="text-[13px] text-muted-foreground">We'll send you a report comparing before/after performance.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
                <TrendingUp className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-[14px] font-medium text-foreground">Review checkout funnel next</p>
                  <p className="text-[13px] text-muted-foreground">That's the second biggest contributor to the performance drop.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <Button className="rounded-lg text-[14px] h-10 gap-2" onClick={() => navigate("/")}>
                Back to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="rounded-lg text-[14px] h-10 gap-2" onClick={() => { setApplied(false); }}>
                <RotateCcw className="h-4 w-4" />
                Undo Changes
              </Button>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
