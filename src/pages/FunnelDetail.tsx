import { DashboardLayout } from "@/components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  TrendingDown,
  Users,
  Zap,
  AlertTriangle,
  ChevronRight,
  ArrowDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const funnelSteps = [
  { name: "Landing Page", users: 10000, conversion: 100, dropOff: 0 },
  { name: "Signup Form", users: 5200, conversion: 52, dropOff: 48 },
  { name: "Email Verification", users: 3800, conversion: 73.1, dropOff: 26.9 },
  { name: "Onboarding", users: 2480, conversion: 65.3, dropOff: 34.7 },
  { name: "First Action", users: 1860, conversion: 75, dropOff: 25 },
];

const segmentData = [
  { segment: "Organic Search", landing: 4200, signup: 2310, verified: 1764, onboarded: 1210, firstAction: 968, convRate: 23.0 },
  { segment: "Paid Ads", landing: 3100, signup: 1488, verified: 950, onboarded: 570, firstAction: 370, convRate: 11.9 },
  { segment: "Direct Traffic", landing: 1800, signup: 936, verified: 748, onboarded: 486, firstAction: 365, convRate: 20.3 },
  { segment: "Social Media", landing: 900, signup: 466, verified: 338, onboarded: 214, firstAction: 157, convRate: 17.4 },
];

const recommendations = [
  {
    severity: "critical" as const,
    title: "Reduce signup form friction",
    description: "48% drop-off at signup. Simplify to email-only registration, add social login options.",
    impact: "+12% conversion",
  },
  {
    severity: "high" as const,
    title: "Improve email verification flow",
    description: "26.9% drop-off at verification. Add magic link option and resend prompt after 30s.",
    impact: "+8% conversion",
  },
  {
    severity: "medium" as const,
    title: "Optimize onboarding steps",
    description: "34.7% drop-off during onboarding. Reduce steps from 5 to 3, add skip option.",
    impact: "+15% conversion",
  },
  {
    severity: "low" as const,
    title: "Add progress indicators",
    description: "Show users how far they are in the flow. Increases completion by reducing uncertainty.",
    impact: "+5% conversion",
  },
];

const severityConfig = {
  critical: { color: "bg-destructive/10 text-destructive border-destructive/20", label: "Critical" },
  high: { color: "bg-chart-warning/10 text-chart-warning border-chart-warning/20", label: "High" },
  medium: { color: "bg-primary/10 text-primary border-primary/20", label: "Medium" },
  low: { color: "bg-muted text-muted-foreground border-border", label: "Low" },
};

export default function FunnelDetail() {
  const navigate = useNavigate();

  const chartData = funnelSteps.map((step) => ({
    name: step.name,
    users: step.users,
    dropOff: step.dropOff,
  }));

  return (
    <DashboardLayout title="Funnel Detail">
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground"
          onClick={() => navigate("/funnels")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-[20px] font-bold text-foreground">Signup Flow Analysis</h2>
          <p className="text-[13px] text-muted-foreground">10,000 users entered · 1,860 completed · Last 30 days</p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Overall Conversion", value: "18.6%", change: "-3.2%", icon: TrendingDown, negative: true },
          { label: "Total Users", value: "10,000", change: "+8%", icon: Users, negative: false },
          { label: "Avg. Time to Convert", value: "4.2 min", change: "-12s", icon: Zap, negative: false },
          { label: "Biggest Drop-off", value: "Signup Form", change: "48%", icon: AlertTriangle, negative: true },
        ].map((kpi) => (
          <div key={kpi.label} className="asana-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-medium text-muted-foreground">{kpi.label}</span>
              <kpi.icon className={`h-3.5 w-3.5 ${kpi.negative ? "text-destructive" : "text-chart-success"}`} />
            </div>
            <p className="text-[22px] font-bold text-foreground tracking-tight">{kpi.value}</p>
            <span className={`text-[12px] font-medium ${kpi.negative ? "text-destructive" : "text-chart-success"}`}>
              {kpi.change}
            </span>
          </div>
        ))}
      </div>

      {/* Conversion Chart + Drop-off Panel */}
      <div className="grid grid-cols-3 gap-4">
        {/* Funnel Conversion Chart */}
        <div className="col-span-2 asana-card p-5">
          <h3 className="text-[15px] font-semibold text-foreground mb-4">Funnel Step Conversion</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="users" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 1 ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
                      opacity={0.85}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Drop-off by Step */}
        <div className="asana-card p-5">
          <h3 className="text-[15px] font-semibold text-foreground mb-4">Drop-off by Step</h3>
          <div className="space-y-3">
            {funnelSteps.slice(1).map((step, i) => (
              <div key={step.name} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-medium text-foreground truncate">{step.name}</span>
                    <div className="flex items-center gap-1">
                      <ArrowDownRight className={`h-3 w-3 ${step.dropOff > 30 ? "text-destructive" : "text-chart-warning"}`} />
                      <span className={`text-[12px] font-semibold tabular-nums ${step.dropOff > 30 ? "text-destructive" : "text-chart-warning"}`}>
                        {step.dropOff}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${step.dropOff}%`,
                        backgroundColor: step.dropOff > 30
                          ? "hsl(var(--chart-alert))"
                          : step.dropOff > 20
                            ? "hsl(var(--chart-warning))"
                            : "hsl(var(--chart-success))",
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {(funnelSteps[i].users - step.users).toLocaleString()} users lost
                  </p>
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
              <TableHead className="text-[12px] font-semibold text-right">Landing</TableHead>
              <TableHead className="text-[12px] font-semibold text-right">Signup</TableHead>
              <TableHead className="text-[12px] font-semibold text-right">Verified</TableHead>
              <TableHead className="text-[12px] font-semibold text-right">Onboarded</TableHead>
              <TableHead className="text-[12px] font-semibold text-right">First Action</TableHead>
              <TableHead className="text-[12px] font-semibold text-right">Conv. Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {segmentData.map((row) => (
              <TableRow key={row.segment} className="cursor-pointer">
                <TableCell className="text-[13px] font-medium text-foreground">
                  <div className="flex items-center gap-2">
                    {row.segment}
                  </div>
                </TableCell>
                <TableCell className="text-[13px] text-right tabular-nums text-muted-foreground">
                  {row.landing.toLocaleString()}
                </TableCell>
                <TableCell className="text-[13px] text-right tabular-nums text-muted-foreground">
                  {row.signup.toLocaleString()}
                </TableCell>
                <TableCell className="text-[13px] text-right tabular-nums text-muted-foreground">
                  {row.verified.toLocaleString()}
                </TableCell>
                <TableCell className="text-[13px] text-right tabular-nums text-muted-foreground">
                  {row.onboarded.toLocaleString()}
                </TableCell>
                <TableCell className="text-[13px] text-right tabular-nums text-muted-foreground">
                  {row.firstAction.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <span className={`text-[13px] font-semibold tabular-nums ${row.convRate > 20 ? "text-chart-success" : row.convRate > 15 ? "text-chart-warning" : "text-destructive"}`}>
                    {row.convRate}%
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Recommended Actions */}
      <div className="asana-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[15px] font-semibold text-foreground">Recommended Actions</h3>
            <p className="text-[12px] text-muted-foreground mt-0.5">AI-generated suggestions to improve conversion</p>
          </div>
          <Button size="sm" className="h-8 text-[13px]" onClick={() => navigate("/insight/performance-drop/action")}>
            Apply All Fixes
          </Button>
        </div>
        <div className="space-y-3">
          {recommendations.map((rec) => {
            const config = severityConfig[rec.severity];
            return (
              <div
                key={rec.title}
                className="flex items-start gap-4 p-4 rounded-lg border border-border bg-background hover:bg-muted/30 transition-colors cursor-pointer group"
              >
                <span className={`shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${config.color}`}>
                  {config.label}
                </span>
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
