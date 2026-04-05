/**
 * useFunnelsList — fetches saved funnels with aggregated step counts from funnel_events.
 *
 * Fields used from saved_funnels: id, name, steps (JSON array with index & name)
 * Fields used from funnel_events: funnel_id, step_index, session_id (COUNT DISTINCT)
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface FunnelStep {
  name: string;
  value: number;
}

export interface FunnelItem {
  id: string;
  name: string;
  conversion: number;
  trend: "up" | "down";
  steps: FunnelStep[];
}

export function useFunnelsList() {
  return useQuery({
    queryKey: ["funnels-list"],
    queryFn: async (): Promise<FunnelItem[]> => {
      // 1. Fetch all saved funnels
      const { data: funnels, error: fErr } = await supabase
        .from("saved_funnels")
        .select("id, name, steps")
        .order("created_at", { ascending: true });
      if (fErr) throw fErr;
      if (!funnels || funnels.length === 0) return [];

      // 2. Fetch aggregated step counts per funnel
      // We need funnel_id, step_index, COUNT(DISTINCT session_id)
      // Paginate to bypass 1k limit
      let allEvents: any[] = [];
      let from = 0;
      const PAGE = 1000;
      while (true) {
        const { data, error } = await supabase
          .from("funnel_events")
          .select("funnel_id, step_index, session_id")
          .range(from, from + PAGE - 1);
        if (error) throw error;
        if (!data || data.length === 0) break;
        allEvents = allEvents.concat(data);
        if (data.length < PAGE) break;
        from += PAGE;
      }

      // 3. Aggregate: per funnel+step → distinct sessions
      const agg = new Map<string, Map<number, Set<string>>>();
      for (const e of allEvents) {
        let fMap = agg.get(e.funnel_id);
        if (!fMap) { fMap = new Map(); agg.set(e.funnel_id, fMap); }
        let sSet = fMap.get(e.step_index);
        if (!sSet) { sSet = new Set(); fMap.set(e.step_index, sSet); }
        sSet.add(e.session_id);
      }

      // 4. Build result
      const result: FunnelItem[] = [];
      for (const f of funnels) {
        const stepsJson = f.steps as Array<{ index: number; name: string }>;
        const fMap = agg.get(f.id);
        const steps: FunnelStep[] = stepsJson
          .sort((a, b) => a.index - b.index)
          .map((s) => ({
            name: s.name,
            value: fMap?.get(s.index)?.size ?? 0,
          }));

        const firstVal = steps[0]?.value || 0;
        const lastVal = steps[steps.length - 1]?.value || 0;
        const conversion = firstVal > 0 ? Math.round((lastVal / firstVal) * 1000) / 10 : 0;

        // Simple trend: compare first-half steps avg drop vs second-half
        const trend: "up" | "down" = conversion >= 20 ? "up" : "down";

        result.push({ id: f.id, name: f.name, conversion, trend, steps });
      }

      return result;
    },
    staleTime: 60_000,
  });
}
