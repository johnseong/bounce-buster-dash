/**
 * React Query hook for fetching insights from the database.
 * Used by Dashboard Overview for primary + secondary insight cards.
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export interface InsightRecord {
  id: string;
  severity: string;       // "critical" | "warning" | "success"
  type: string;            // "performance" | "speed" | "engagement" etc.
  title: string;
  description: string;
  impact: string | null;
  relatedPagePath: string | null;
  metadata: Record<string, string>;
  isRead: boolean;
  createdAt: string;
}

function parseMetadata(raw: Json): Record<string, string> {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const result: Record<string, string> = {};
    for (const [k, v] of Object.entries(raw)) {
      if (typeof v === "string") result[k] = v;
    }
    return result;
  }
  return {};
}

/** Fetch all insights ordered by severity (critical first), then newest. */
export function useInsights() {
  return useQuery({
    queryKey: ["dashboard-insights"],
    queryFn: async (): Promise<InsightRecord[]> => {
      const { data, error } = await supabase
        .from("insights")
        .select("id, severity, type, title, description, impact, related_page_path, metadata, is_read, created_at")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      return (data ?? []).map((row) => ({
        id: row.id,
        severity: row.severity,
        type: row.type,
        title: row.title,
        description: row.description,
        impact: row.impact,
        relatedPagePath: row.related_page_path,
        metadata: parseMetadata(row.metadata),
        isRead: row.is_read,
        createdAt: row.created_at,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
}
