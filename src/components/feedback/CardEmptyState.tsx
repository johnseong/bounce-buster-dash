/**
 * CardEmptyState — Placeholder shown when a data card has no results.
 */

import { Inbox } from "lucide-react";

interface CardEmptyStateProps {
  title?: string;
  message?: string;
}

export function CardEmptyState({
  title = "No data available",
  message = "No data for this period — adjust the date range or check your integration.",
}: CardEmptyStateProps) {
  return (
    <div className="asana-card p-8 flex flex-col items-center justify-center text-center min-h-[240px]">
      <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-3">
        <Inbox className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="text-[14px] font-semibold text-foreground">{title}</p>
      <p className="text-[13px] text-muted-foreground mt-1 max-w-sm">{message}</p>
    </div>
  );
}
