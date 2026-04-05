/**
 * useSegments — fetches user segments from the database.
 *
 * Fields used from user_segments:
 *   id, name, icon_key, color_class, filter_rules (JSON with count, bounce, avgSession)
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SegmentRow {
  id: string;
  name: string;
  iconKey: string;
  color: string;
  count: number;
  bounce: string;
  avgSession: string;
}

export function useSegments() {
  return useQuery({
    queryKey: ["user-segments"],
    queryFn: async (): Promise<SegmentRow[]> => {
      const { data, error } = await supabase
        .from("user_segments")
        .select("id, name, icon_key, color_class, filter_rules")
        .order("created_at", { ascending: true });
      if (error) throw error;
      if (!data) return [];

      return data.map((s) => {
        const rules = s.filter_rules as Record<string, any>;
        return {
          id: s.id,
          name: s.name,
          iconKey: s.icon_key,
          color: s.color_class,
          count: rules?.count ?? 0,
          bounce: rules?.bounce ?? "0%",
          avgSession: rules?.avgSession ?? "0m 00s",
        };
      });
    },
    staleTime: 60_000,
  });
}
