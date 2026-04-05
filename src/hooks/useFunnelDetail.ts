/**
 * useFunnelDetail — fetches a single funnel definition + step-level metrics + segment breakdown.
 *
 * Fields used:
 *   saved_funnels: id, name, steps (JSON array)
 *   funnel_events: funnel_id, step_index, step_name, session_id, source
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface FunnelStep {
  name: string;
  users: number;
  conversion: number;
  dropOff: number;
}

export interface SegmentRow {
  segment: string;
  steps: Record<number, number>; // stepIndex -> session count
  convRate: number;
}

export interface FunnelDetailData {
  funnelName: string;
  steps: FunnelStep[];
  segments: SegmentRow[];
  totalUsers: number;
  completedUsers: number;
  overallConversion: number;
  biggestDropStep: string;
  biggestDropPct: number;
}

export function useFunnelDetail(funnelId?: string) {
  return useQuery({
    queryKey: ["funnel-detail", funnelId ?? "first"],
    queryFn: async (): Promise<FunnelDetailData | null> => {
      // 1. Get funnel definition
      let funnelQuery = supabase.from("saved_funnels").select("id, name, steps");
      if (funnelId) {
        funnelQuery = funnelQuery.eq("id", funnelId);
      }
      const { data: funnels, error: fErr } = await funnelQuery.limit(1);
      if (fErr) throw fErr;
      if (!funnels || funnels.length === 0) return null;

      const funnel = funnels[0];
      const stepsJson = funnel.steps as Array<{ index: number; name: string }>;
      const stepsSorted = [...stepsJson].sort((a, b) => a.index - b.index);

      // 2. Fetch all funnel_events for this funnel (paginated)
      let allEvents: Array<{ step_index: number; session_id: string; source: string | null }> = [];
      let from = 0;
      const PAGE = 1000;
      while (true) {
        const { data, error } = await supabase
          .from("funnel_events")
          .select("step_index, session_id, source")
          .eq("funnel_id", funnel.id)
          .range(from, from + PAGE - 1);
        if (error) throw error;
        if (!data || data.length === 0) break;
        allEvents = allEvents.concat(data);
        if (data.length < PAGE) break;
        from += PAGE;
      }

      if (allEvents.length === 0) return null;

      // 3. Aggregate per step: distinct sessions
      const stepSessions = new Map<number, Set<string>>();
      const segStepSessions = new Map<string, Map<number, Set<string>>>();

      for (const e of allEvents) {
        // Per-step
        let s = stepSessions.get(e.step_index);
        if (!s) { s = new Set(); stepSessions.set(e.step_index, s); }
        s.add(e.session_id);

        // Per-segment per-step
        const seg = e.source || "Unknown";
        let segMap = segStepSessions.get(seg);
        if (!segMap) { segMap = new Map(); segStepSessions.set(seg, segMap); }
        let ss = segMap.get(e.step_index);
        if (!ss) { ss = new Set(); segMap.set(e.step_index, ss); }
        ss.add(e.session_id);
      }

      // 4. Build steps array
      const steps: FunnelStep[] = [];
      let biggestDropStep = "";
      let biggestDropPct = 0;

      for (let i = 0; i < stepsSorted.length; i++) {
        const users = stepSessions.get(stepsSorted[i].index)?.size ?? 0;
        const prevUsers = i === 0 ? users : (stepSessions.get(stepsSorted[i - 1].index)?.size ?? 0);
        const conversion = i === 0 ? 100 : (prevUsers > 0 ? Math.round((users / prevUsers) * 1000) / 10 : 0);
        const dropOff = i === 0 ? 0 : Math.round((1 - users / prevUsers) * 1000) / 10;

        if (i > 0 && dropOff > biggestDropPct) {
          biggestDropPct = dropOff;
          biggestDropStep = stepsSorted[i].name;
        }

        steps.push({ name: stepsSorted[i].name, users, conversion, dropOff });
      }

      const totalUsers = steps[0]?.users || 0;
      const completedUsers = steps[steps.length - 1]?.users || 0;
      const overallConversion = totalUsers > 0 ? Math.round((completedUsers / totalUsers) * 1000) / 10 : 0;

      // 5. Build segment rows
      const segments: SegmentRow[] = [];
      for (const [seg, segMap] of segStepSessions) {
        const stepsRecord: Record<number, number> = {};
        for (const [idx, sessSet] of segMap) {
          stepsRecord[idx] = sessSet.size;
        }
        const firstStep = stepsRecord[stepsSorted[0]?.index] ?? 0;
        const lastStep = stepsRecord[stepsSorted[stepsSorted.length - 1]?.index] ?? 0;
        const convRate = firstStep > 0 ? Math.round((lastStep / firstStep) * 1000) / 10 : 0;
        segments.push({ segment: seg, steps: stepsRecord, convRate });
      }
      segments.sort((a, b) => (b.steps[0] ?? 0) - (a.steps[0] ?? 0));

      return {
        funnelName: funnel.name,
        steps,
        segments,
        totalUsers,
        completedUsers,
        overallConversion,
        biggestDropStep,
        biggestDropPct,
      };
    },
    staleTime: 60_000,
  });
}
