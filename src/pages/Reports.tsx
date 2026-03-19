import { DashboardLayout } from "@/components/DashboardLayout";
import { FileText, Download, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const reports = [
  { name: "Weekly Performance Summary", date: "Mar 14, 2026", type: "Automated", status: "Ready" },
  { name: "Monthly Bounce Analysis", date: "Mar 1, 2026", type: "Automated", status: "Ready" },
  { name: "Q1 User Retention Report", date: "Feb 28, 2026", type: "Custom", status: "Ready" },
  { name: "Drop-off Deep Dive – Checkout", date: "Feb 20, 2026", type: "Custom", status: "Ready" },
  { name: "A/B Test Results – Homepage", date: "Feb 15, 2026", type: "Custom", status: "Ready" },
  { name: "Traffic Source Analysis", date: "Feb 10, 2026", type: "Automated", status: "Ready" },
];

const scheduled = [
  { name: "Weekly Performance Summary", frequency: "Every Monday", nextRun: "Mar 21, 2026" },
  { name: "Monthly Bounce Analysis", frequency: "1st of month", nextRun: "Apr 1, 2026" },
];

export default function Reports() {
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
            <p className="text-[22px] font-bold text-foreground">{scheduled.length}</p>
          </div>
        </div>
        <div className="asana-card p-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-chart-warning/10 flex items-center justify-center">
            <Clock className="h-5 w-5 text-chart-warning" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground/60 font-medium">Last Generated</p>
            <p className="text-[14px] font-medium text-foreground">2 hours ago</p>
          </div>
        </div>
      </div>

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
              <tr key={report.name} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4 text-muted-foreground/50" />
                    <span className="font-medium text-foreground">{report.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`text-[12px] px-2.5 py-1 rounded-md font-medium ${report.type === "Automated" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                    {report.type}
                  </span>
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

      <div className="asana-card p-6">
        <h3 className="text-[15px] font-semibold text-foreground mb-4">Scheduled Reports</h3>
        <div className="space-y-3">
          {scheduled.map((s) => (
            <div key={s.name} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
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
    </DashboardLayout>
  );
}
