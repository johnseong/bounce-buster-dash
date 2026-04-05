/**
 * useReports — fetches saved reports and scheduled reports from the database.
 *
 * Fields used:
 *   saved_reports: id, title, report_type, created_at
 *   scheduled_reports: id, report_id, frequency, next_run_at, is_active
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export interface ReportRow {
  id: string;
  name: string;
  type: string;
  date: string;
}

export interface ScheduledRow {
  id: string;
  name: string;
  frequency: string;
  nextRun: string;
}

export function useReports() {
  return useQuery({
    queryKey: ["reports-list"],
    queryFn: async () => {
      // Fetch saved reports
      const { data: reports, error: rErr } = await supabase
        .from("saved_reports")
        .select("id, title, report_type, created_at")
        .order("created_at", { ascending: false });
      if (rErr) throw rErr;

      // Fetch scheduled reports with their report titles
      const { data: schedules, error: sErr } = await supabase
        .from("scheduled_reports")
        .select("id, report_id, frequency, next_run_at, is_active")
        .eq("is_active", true)
        .order("next_run_at", { ascending: true });
      if (sErr) throw sErr;

      // Map report IDs to titles for scheduled reports
      const reportMap = new Map<string, string>();
      for (const r of reports ?? []) {
        reportMap.set(r.id, r.title);
      }

      const reportRows: ReportRow[] = (reports ?? []).map((r) => ({
        id: r.id,
        name: r.title,
        type: r.report_type,
        date: format(new Date(r.created_at), "MMM d, yyyy"),
      }));

      const scheduledRows: ScheduledRow[] = (schedules ?? []).map((s) => ({
        id: s.id,
        name: reportMap.get(s.report_id) ?? "Unknown Report",
        frequency: s.frequency,
        nextRun: format(new Date(s.next_run_at), "MMM d, yyyy"),
      }));

      // Compute "last generated" from most recent report
      const lastGenerated = reports && reports.length > 0
        ? timeSince(new Date(reports[0].created_at))
        : "Never";

      return { reports: reportRows, scheduled: scheduledRows, lastGenerated };
    },
    staleTime: 60_000,
  });
}

function timeSince(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const hours = Math.floor(diffMs / 3_600_000);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return "Just now";
}
