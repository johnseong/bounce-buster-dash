/**
 * React Query hook for fetching drop-off funnel data from funnel_events.
 * Aggregates session counts per step and computes drop-off / retention.
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface FunnelStep {
  name: string;
  visitors: number;
  dropOff: number;
  rate: string;
}

export interface DropOffInsight {
  title: string;
  desc: string;
  severity: "high" | "medium";
}

const DEMO_FUNNEL_ID = "a0000000-0000-0000-0000-000000000001";

async function fetchAllFunnelEvents() {
  const PAGE_SIZE = 1000;
  let allRows: { step_name: string; step_index: number; session_id: string }[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from("funnel_events")
      .select("step_name, step_index, session_id")
      .eq("funnel_id", DEMO_FUNNEL_ID)
      .range(from, from + PAGE_SIZE - 1);

    if (error) throw error;
    if (!data || data.length === 0) break;
    allRows = allRows.concat(data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return allRows;
}

function computeSteps(rows: { step_name: string; step_index: number; session_id: string }[]): FunnelStep[] {
  // Group by step_index, count distinct sessions
  const stepMap = new Map<number, { name: string; sessions: Set<string> }>();

  for (const row of rows) {
    let entry = stepMap.get(row.step_index);
    if (!entry) {
      entry = { name: row.step_name, sessions: new Set() };
      stepMap.set(row.step_index, entry);
    }
    entry.sessions.add(row.session_id);
  }

  const sorted = Array.from(stepMap.entries()).sort(([a], [b]) => a - b);
  const firstCount = sorted[0]?.[1].sessions.size || 1;

  return sorted.map(([, entry], i) => {
    const visitors = entry.sessions.size;
    const prevVisitors = i > 0 ? sorted[i - 1][1].sessions.size : visitors;
    const dropOff = i > 0 ? prevVisitors - visitors : 0;
    const retention = ((visitors / firstCount) * 100).toFixed(1);
    return {
      name: entry.name,
      visitors,
      dropOff,
      rate: i === 0 ? "100%" : `${retention}%`,
    };
  });
}

function deriveInsights(steps: FunnelStep[]): DropOffInsight[] {
  if (steps.length < 2) return [];

  // Find biggest absolute drop-off
  let maxDrop = { idx: 1, val: 0 };
  for (let i = 1; i < steps.length; i++) {
    if (steps[i].dropOff > maxDrop.val) {
      maxDrop = { idx: i, val: steps[i].dropOff };
    }
  }

  const dropPct = steps[maxDrop.idx - 1].visitors > 0
    ? ((maxDrop.val / steps[maxDrop.idx - 1].visitors) * 100).toFixed(1)
    : "0";

  const insights: DropOffInsight[] = [
    {
      title: "Biggest Drop-off",
      desc: `${steps[maxDrop.idx - 1].name} → ${steps[maxDrop.idx].name} loses ${dropPct}% of users`,
      severity: "high",
    },
  ];

  // Checkout friction (if checkout step exists)
  const checkoutIdx = steps.findIndex((s) => s.name.toLowerCase().includes("checkout"));
  if (checkoutIdx > 0) {
    const abRate = steps[checkoutIdx - 1].visitors > 0
      ? ((steps[checkoutIdx].dropOff / steps[checkoutIdx - 1].visitors) * 100).toFixed(1)
      : "0";
    insights.push({
      title: "Checkout Friction",
      desc: `Payment page has ${abRate}% abandonment rate`,
      severity: "medium",
    });
  }

  // Overall conversion
  const overall = steps.length >= 2
    ? ((steps[steps.length - 1].visitors / steps[0].visitors) * 100).toFixed(1)
    : "100";
  insights.push({
    title: "End-to-End Conversion",
    desc: `Only ${overall}% of visitors complete the full funnel`,
    severity: parseFloat(overall) < 15 ? "high" : "medium",
  });

  return insights;
}

export function useDropOffData() {
  return useQuery({
    queryKey: ["drop-off-funnel", DEMO_FUNNEL_ID],
    queryFn: async () => {
      const rows = await fetchAllFunnelEvents();
      const steps = computeSteps(rows);
      const insights = deriveInsights(steps);
      return { steps, insights };
    },
    staleTime: 5 * 60 * 1000,
  });
}
