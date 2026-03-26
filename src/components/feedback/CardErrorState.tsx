/**
 * CardErrorState — Error fallback for data cards with optional retry action.
 */

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CardErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function CardErrorState({
  title = "Failed to load",
  message = "Couldn't load this chart — data source may be temporarily unavailable.",
  onRetry,
}: CardErrorStateProps) {
  return (
    <div className="asana-card p-8 flex flex-col items-center justify-center text-center min-h-[240px] border-destructive/20">
      <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-3">
        <AlertCircle className="h-6 w-6 text-destructive" />
      </div>
      <p className="text-[14px] font-semibold text-foreground">{title}</p>
      <p className="text-[13px] text-muted-foreground mt-1 max-w-sm">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-4 gap-1.5 text-[13px] h-8" onClick={onRetry}>
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </Button>
      )}
    </div>
  );
}
