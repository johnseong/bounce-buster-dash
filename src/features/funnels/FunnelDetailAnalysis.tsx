/**
 * FunnelDetailAnalysis — Deep-dive into a single funnel.
 * Now powered by live data from saved_funnels + funnel_events.
 *
 * Sections:
 *  1. KPI summary row (conversion, users, biggest drop-off)
 *  2. Bar chart showing user counts per funnel step
 *  3. Drop-off percentage panel with colour-coded severity bars
 *  4. Segment breakdown table (traffic source × funnel step)
 *  5. AI-generated recommended actions (still static)
 */

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, TrendingDown, Users, Zap, AlertTriangle, ChevronRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { CardEmptyState } from "@/components/feedback/CardEmptyState";
import { CardErrorState } from "@/components/feedback/CardErrorState";
import { useFunnelDetail } from "@/hooks/useFunnelDetail";
import { recommendations, severityConfig } from "./data/funnelDetailData";

export default function FunnelDetailAnalysis() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const funnelId = searchParams.get("id") ?? undefined;

  const { data, isLoading, isError, refetch } = useFunnelDetail(funnelId);

  // Loading skeleton
  if (isLoading) {
    return (
      <DashboardLayout title="Funnel Detail">
        <div className="flex items-center gap-3 mb-1">
          <Skeleton className="h-8 w-8 rounded" />
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3.5 w-64" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="asana-card p-4 space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-16" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 asana-card p-5">
            <Skeleton className="h-[280px] w-full rounded-lg" />
          </div>
          <div className="asana-card p-5 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-8 w-full rounded" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (isError) {
    return (
      <DashboardLayout title="Funnel Detail">
        <CardErrorState
          title="Failed to load funnel"
          message="Couldn't load funnel detail data — please try again."
          onRetry={() => refetch()}
        />
      </DashboardLayout>
    );
  }

  // Empty state
  if (!data || data.steps.length === 0) {
    return (
      <DashboardLayout title="Funnel Detail">
        <div className="flex items-center gap-3 mb-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => navigate("/funnels")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-[20px] font-bold text-foreground">Funnel Detail</h2>
        </div>
        <CardEmptyState
          title="No funnel data"
          message="This funnel has no events yet. Start tracking to see conversion data."
        />
      </DashboardLayout>
    );
  }

  const { steps, segments, funnelName, totalUsers, completedUsers, overallConversion, biggestDropStep, biggestDropPct } = data;

  const chartData = steps.map((step) => ({
    name: step.name,
    users: step.users,
    dropOff: step.dropOff,
  }));

  // Find the step index with biggest drop-off for chart highlighting
  const worstStepIdx = steps.findIndex((s) => s.name === biggestDropStep);

  // Build step name list for segment table headers
  const stepNames = steps.map((s) => s.name);

  return (
    <DashboardLayout title="Funnel Detail">
      {/* Header with back navigation */}
      <div className="flex items-center gap-3 mb-1">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => navigate("/funnels")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-[20px] font-bold text-foreground">{funnelName} Analysis</h2>
          <p className="text-[13px] text-muted-foreground">
            {totalUsers.toLocaleString()} users entered · {completedUsers.toLocaleString()} completed · Last 30 days
          </p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Overall Conversion", value: `${overallConversion}%`, change: overallConversion < 20 ? "Low" : "Healthy", icon: TrendingDown, negative: overallConversion < 20 },
          { label: "Total Users", value: totalUsers.toLocaleString(), change: "", icon: Users, negative: false },
          { label: "Completed Users", value: completedUsers.toLocaleString(), change: "", icon: Zap, negative: false },
          { label: "Biggest Drop-off", value: biggestDropStep, change: `${biggestDropPct}%`, icon: AlertTriangle, negative: true },
        ].map((kpi) => (
          <div key={kpi.label} className="asana-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-medium text-muted-foreground">{kpi.label}</span>
              <kpi.icon className={`h-3.5 w-3.5 ${kpi.negative ? "text-destructive" : "text-chart-success"}`} />
            </div>
            <p className="text-[22px] font-bold text-foreground tracking-tight">{kpi.value}</p>
            {kpi.change && (
              <span className={`text-[12px] font-medium ${kpi.negative ? "text-destructive" : "text-chart-success"}`}>{kpi.change}</span>
            )}
          </div>
        ))}
      </div>

      {/* Conversion Chart + Drop-off Panel */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 asana-card p-5">
          <h3 className="text-[15px] font-semibold text-foreground mb-4">Funnel Step Conversion</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                <Bar dataKey="users" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === worstStepIdx ? "hsl(var(--destructive))" : "hsl(var(--primary))"} opacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="asana-card p-5">
          <h3 className="text-[15px] font-semibold text-foreground mb-4">Drop-off by Step</h3>
          <div className="space-y-3">
            {steps.slice(1).map((step, i) => (
              <div key={step.name} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-medium text-foreground truncate">{step.name}</span>
                    <div className="flex items-center gap-1">
                      <ArrowDownRight className={`h-3 w-3 ${step.dropOff > 30 ? "text-destructive" : "text-chart-warning"}`} />
                      <span className={`text-[12px] font-semibold tabular-nums ${step.dropOff > 30 ? "text-destructive" : "text-chart-warning"}`}>{step.dropOff}%</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${step.dropOff}%`, backgroundColor: step.dropOff > 30 ? "hsl(var(--chart-alert))" : step.dropOff > 20 ? "hsl(var(--chart-warning))" : "hsl(var(--chart-success))" }} />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{(steps[i].users - step.users).toLocaleString()} users lost</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Segment Breakdown Table */}
      <div className="asana-card">
        <div className="p-5 pb-3">
          <h3 className="text-[15px] font-semibold text-foreground">Segment Breakdown</h3>
          <p className="text-[12px] text-muted-foreground mt-0.5">Conversion by traffic source across funnel steps</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[12px] font-semibold">Segment</TableHead>
              {stepNames.map((name) => (
                <TableHead key={name} className="text-[12px] font-semibold text-right">{name}</TableHead>
              ))}
              <TableHead className="text-[12px] font-semibold text-right">Conv. Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {segments.map((row) => (
              <TableRow key={row.segment} className="cursor-pointer">
                <TableCell className="text-[13px] font-medium text-foreground">{row.segment}</TableCell>
                {steps.map((_, idx) => (
                  <TableCell key={idx} className="text-[13px] text-right tabular-nums text-muted-foreground">
                    {(row.steps[idx] ?? 0).toLocaleString()}
                  </TableCell>
                ))}
                <TableCell className="text-right">
                  <span className={`text-[13px] font-semibold tabular-nums ${row.convRate > 20 ? "text-chart-success" : row.convRate > 15 ? "text-chart-warning" : "text-destructive"}`}>{row.convRate}%</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Recommended Actions (still static) */}
      <div className="asana-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[15px] font-semibold text-foreground">Recommended Actions</h3>
            <p className="text-[12px] text-muted-foreground mt-0.5">AI-generated suggestions to improve conversion</p>
          </div>
          <Button size="sm" className="h-8 text-[13px]" onClick={() => navigate("/insight/performance-drop/action")}>Apply All Fixes</Button>
        </div>
        <div className="space-y-3">
          {recommendations.map((rec) => {
            const config = severityConfig[rec.severity];
            return (
              <div key={rec.title} className="flex items-start gap-4 p-4 rounded-lg border border-border bg-background hover:bg-muted/30 transition-colors cursor-pointer group">
                <span className={`shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${config.color}`}>{config.label}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-foreground">{rec.title}</p>
                  <p className="text-[12px] text-muted-foreground mt-0.5">{rec.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[12px] font-semibold text-chart-success">{rec.impact}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
