/**
 * PerformanceInsight — Detailed breakdown of a performance alert.
 *
 * Data flow: Static data from ./data/insightData.ts.
 * Sections:
 *  1. Alert header with severity and description
 *  2. Bounce rate comparison bar chart (this week vs last week)
 *  3. Root-cause analysis cards
 *  4. Recommended actions with "Fix Now" / "View" CTAs
 */

import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  TrendingDown, ArrowLeft, ArrowRight, Smartphone, Monitor, ShoppingCart,
  AlertTriangle, Lightbulb, ArrowDownRight, CheckCircle2,
} from "lucide-react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { weeklyComparison, contributors, insightRecommendations } from "./data/insightData";

const contributorIcons = { smartphone: Smartphone, "shopping-cart": ShoppingCart, monitor: Monitor };

export default function PerformanceInsight() {
  const navigate = useNavigate();

  return (
    <DashboardLayout title="Insight Detail">
      {/* Back navigation */}
      <div className="flex items-center gap-2">
        <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
        </button>
      </div>

      {/* Insight header */}
      <div className="asana-card p-6 border-l-4 border-l-destructive">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
            <TrendingDown className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-destructive">Performance Alert</span>
            <h1 className="text-[22px] font-bold text-foreground mt-1 leading-snug">Your performance dropped by 15% this week</h1>
            <p className="text-[14px] text-muted-foreground mt-2 leading-relaxed max-w-2xl">
              Between March 12–18, your overall bounce rate climbed from 52% to 60%.
              This was primarily driven by a spike in mobile visitor drop-offs and increased friction in the checkout funnel.
              Here's what happened and what you can do about it.
            </p>
          </div>
        </div>
      </div>

      {/* Bounce rate comparison chart */}
      <div className="asana-card p-6">
        <h2 className="text-[15px] font-semibold text-foreground mb-1">Bounce Rate: This Week vs Last Week</h2>
        <p className="text-[12px] text-muted-foreground mb-5">Daily bounce rate comparison showing the increase</p>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyComparison} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="0" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} dy={8} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} domain={[40, 70]} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "13px", fontWeight: 500, padding: "8px 12px" }} formatter={(value: number) => [`${value}%`, ""]} />
              <Bar dataKey="lastWeek" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} name="Last week" />
              <Bar dataKey="thisWeek" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} name="This week" opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-5 mt-3">
          <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-sm bg-muted" /><span className="text-[12px] text-muted-foreground">Last week (avg 52%)</span></div>
          <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-sm bg-destructive opacity-85" /><span className="text-[12px] text-muted-foreground">This week (avg 60%)</span></div>
        </div>
      </div>

      {/* Root-cause analysis */}
      <div className="asana-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <AlertTriangle className="h-4 w-4 text-chart-warning" />
          <h2 className="text-[15px] font-semibold text-foreground">What caused this?</h2>
        </div>
        <div className="space-y-4">
          {contributors.map((item) => {
            const Icon = contributorIcons[item.iconKey as keyof typeof contributorIcons];
            return (
              <div key={item.label} className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${item.severity === "high" ? "bg-destructive/10 text-destructive" : "bg-chart-success/10 text-chart-success"}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-foreground">{item.label}</p>
                  <p className="text-[13px] text-muted-foreground mt-0.5">{item.detail}</p>
                </div>
                {item.severity === "high" ? <ArrowDownRight className="h-4 w-4 text-destructive shrink-0 mt-1" /> : <CheckCircle2 className="h-4 w-4 text-chart-success shrink-0 mt-1" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommended actions */}
      <div className="asana-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Lightbulb className="h-4 w-4 text-chart-warning" />
          <h2 className="text-[15px] font-semibold text-foreground">Recommended Actions</h2>
        </div>
        <div className="space-y-3">
          {insightRecommendations.map((rec, i) => (
            <div key={rec.title} className={`flex items-start justify-between gap-4 p-4 rounded-xl border transition-colors ${rec.primary ? "border-primary/30 bg-accent/50" : "border-border/50 bg-muted/20"}`}>
              <div className="flex items-start gap-3">
                <span className="h-6 w-6 rounded-lg bg-primary/10 text-primary text-[12px] flex items-center justify-center font-bold shrink-0">{i + 1}</span>
                <div>
                  <p className="text-[14px] font-semibold text-foreground">{rec.title}</p>
                  <p className="text-[13px] text-muted-foreground mt-0.5">{rec.description}</p>
                  <p className="text-[12px] text-chart-success font-medium mt-1.5">{rec.impact}</p>
                </div>
              </div>
              <Button size="sm" variant={rec.primary ? "default" : "outline"} className="rounded-lg text-[13px] h-8 shrink-0 gap-1.5" onClick={() => navigate("/insight/performance-drop/action")}>
                {rec.primary ? "Fix Now" : "View"} <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
