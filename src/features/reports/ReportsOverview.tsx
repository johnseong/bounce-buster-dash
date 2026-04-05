/**
 * ReportsOverview — Lists generated reports and scheduled report automations.
 * Now powered by live data from saved_reports + scheduled_reports.
 *
 * Sections:
 *  1. Summary KPI cards (total, scheduled count, last generated)
 *  2. Recent reports table with download actions
 *  3. Scheduled reports list with next-run dates
 */

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FileText, Download, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CardEmptyState } from "@/components/feedback/CardEmptyState";
import { CardErrorState } from "@/components/feedback/CardErrorState";
import { useReports } from "@/hooks/useReports";

export default function ReportsOverview() {
  const { data, isLoading, isError, refetch } = useReports();

  if (isLoading) {
    return (
      <DashboardLayout title="Reports">
        <h2 className="text-[20px] font-bold text-foreground">Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="asana-card p-5 flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-10" />
              </div>
            </div>
          ))}
        </div>
        <div className="asana-card p-5 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-full rounded" />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout title="Reports">
        <h2 className="text-[20px] font-bold text-foreground">Reports</h2>
        <CardErrorState
          title="Failed to load reports"
          message="Couldn't load report data — please try again."
          onRetry={() => refetch()}
        />
      </DashboardLayout>
    );
  }

  const reports = data?.reports ?? [];
  const scheduledReports = data?.scheduled ?? [];
  const lastGenerated = data?.lastGenerated ?? "Never";

  return (
    <DashboardLayout title="Reports">
      <h2 className="text-[20px] font-bold text-foreground">Reports</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="asana-card p-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center">
            <FileText className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground/60 font-medium">Total Reports</p>
            <p className="text-[22px] font-bold text-foreground">{reports.length}</p>
          </div>
        </div>
        <div className="asana-card p-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-chart-success/10 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-chart-success" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground/60 font-medium">Scheduled</p>
            <p className="text-[22px] font-bold text-foreground">{scheduledReports.length}</p>
          </div>
        </div>
        <div className="asana-card p-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-chart-warning/10 flex items-center justify-center">
            <Clock className="h-5 w-5 text-chart-warning" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground/60 font-medium">Last Generated</p>
            <p className="text-[14px] font-medium text-foreground">{lastGenerated}</p>
          </div>
        </div>
      </div>

      {reports.length === 0 ? (
        <CardEmptyState title="No reports yet" message="Generate your first report to get started." />
      ) : (
        <div className="asana-card overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h3 className="text-[15px] font-semibold text-foreground">Recent Reports</h3>
            <Button size="sm" className="rounded-lg text-[13px] h-8">Generate New</Button>
          </div>
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left font-medium px-5 py-3">Report</th>
                <th className="text-left font-medium px-5 py-3">Type</th>
                <th className="text-left font-medium px-5 py-3">Date</th>
                <th className="text-right font-medium px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <FileText className="h-4 w-4 text-muted-foreground/50" />
                      <span className="font-medium text-foreground">{report.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[12px] px-2.5 py-1 rounded-md font-medium ${report.type === "Automated" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>{report.type}</span>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{report.date}</td>
                  <td className="px-5 py-3.5 text-right">
                    <Button variant="ghost" size="sm" className="h-7 px-2.5 rounded-lg text-muted-foreground hover:text-foreground">
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {scheduledReports.length === 0 ? (
        <CardEmptyState title="No scheduled reports" message="Set up a schedule to automate report generation." />
      ) : (
        <div className="asana-card p-6">
          <h3 className="text-[15px] font-semibold text-foreground mb-4">Scheduled Reports</h3>
          <div className="space-y-3">
            {scheduledReports.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                <div>
                  <p className="text-[14px] font-medium text-foreground">{s.name}</p>
                  <p className="text-[12px] text-muted-foreground">{s.frequency}</p>
                </div>
                <div className="text-right">
                  <p className="text-[12px] text-muted-foreground">Next run</p>
                  <p className="text-[13px] font-medium text-foreground">{s.nextRun}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
