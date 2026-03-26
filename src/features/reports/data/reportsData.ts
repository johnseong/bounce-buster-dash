/**
 * Reports mock data — generated and scheduled reports.
 */

export const reports = [
  { name: "Weekly Performance Summary", date: "Mar 14, 2026", type: "Automated", status: "Ready" },
  { name: "Monthly Bounce Analysis", date: "Mar 1, 2026", type: "Automated", status: "Ready" },
  { name: "Q1 User Retention Report", date: "Feb 28, 2026", type: "Custom", status: "Ready" },
  { name: "Drop-off Deep Dive – Checkout", date: "Feb 20, 2026", type: "Custom", status: "Ready" },
  { name: "A/B Test Results – Homepage", date: "Feb 15, 2026", type: "Custom", status: "Ready" },
  { name: "Traffic Source Analysis", date: "Feb 10, 2026", type: "Automated", status: "Ready" },
];

export const scheduledReports = [
  { name: "Weekly Performance Summary", frequency: "Every Monday", nextRun: "Mar 21, 2026" },
  { name: "Monthly Bounce Analysis", frequency: "1st of month", nextRun: "Apr 1, 2026" },
];
