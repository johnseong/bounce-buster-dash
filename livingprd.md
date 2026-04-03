# Bounce — Product Requirements Document (Living PRD)

> **Version:** 1.1  
> **Date:** April 3, 2026  
> **Status:** Hybrid — Dashboard Overview live on seeded DB; other screens static mock  
> **Stakeholders:** Product, Growth, Engineering

---

## 1. Product Overview

**Bounce** is a user engagement analytics dashboard that helps product teams understand funnel conversion, drop-offs, and user behaviour. Unlike traditional analytics tools that present raw data, Bounce surfaces **actionable insights** — telling users not just *what* happened, but *why* it happened and *what to do about it*.

The core differentiator is the **Insight → Analysis → Action** loop: the product prioritises a single critical insight at the top of the dashboard, lets users drill into root causes, and guides them through applying a recommended fix — all within the same interface.

---

## 2. Target Users

| Persona | Role | Primary Need |
|---------|------|-------------|
| **Product Manager** | Owns conversion metrics | Quickly assess product health; identify and resolve drop-off issues |
| **Growth Lead** | Drives activation & retention | Understand which user segments convert best; find leverage points |
| **Analytics Team Member** | Supports data-driven decisions | Access funnel breakdowns and segment data without writing queries |

### User Characteristics

- Non-technical to semi-technical; comfortable with dashboards but not SQL
- Time-constrained; checks dashboard 2–5 times per week
- Cares about **"Is my performance good or bad?"** before diving into details
- Frustrated by dashboards that show 12+ charts without clear takeaways

---

## 3. Problem Statement

**Teams can see analytics data but struggle to identify *why* users drop off and *what actions* to take to improve conversion and engagement.**

### Supporting Evidence (from user research)

| Signal | Detail |
|--------|--------|
| User quote | *"I log in, see too many charts, and feel overwhelmed."* |
| User quote | *"I just want to know if my performance is good or bad."* |
| User quote | *"The data is there, but I don't know what to do with it."* |
| Metric | First-visit bounce rate on existing dashboard: **60%** |
| Metric | Time to first insight: unclear / too long |
| Metric | Default dashboard shows **12 charts** with no prioritisation |

### Core Metric

- **Funnel conversion rate** and **activation rate** — the product exists to help teams improve these numbers.

---

## 4. Screens and Their Purpose

### 4.1 Dashboard Overview (`/`)

**Purpose:** Answer *"Is my performance good or bad?"* in under 10 seconds.

| Section | What it shows | Data source |
|---------|--------------|-------------|
| KPI Metric Bar (4 cards) | Total Sessions, Bounce Rate, Avg. Session Duration, Conversion Rate — each with trend indicator | ✅ Live DB (`analytics_events`) |
| Primary Insight Card | The single most critical issue (e.g., "Performance dropped 15%"), with severity badge, root cause summary, and action CTAs | ⚠️ Partially static |
| Secondary Insight Cards (×2) | Supporting insights: one warning (mobile speed), one opportunity (docs engagement) | ⚠️ Static mock |
| Daily Active Users Chart | 14-day area chart showing DAU trend | ✅ Live DB (`analytics_events`) |
| Top Drop-off Pages | Ranked list of pages with highest bounce rates | ✅ Live DB (`page_analytics`) |

**Loading state:** Skeleton screens for all sections  
**Error state:** Retry-able error card for chart failures  
**Empty state:** Helpful message with call-to-action

### 4.2 Insight Detail (`/insight/performance-drop`)

**Purpose:** Explain *why* performance changed and present options to fix it.

| Section | What it shows |
|---------|--------------|
| Alert Header | Severity label, headline, and contextual description |
| Bounce Rate Comparison Chart | This week vs. last week bar chart, showing the increase day-by-day |
| Root Cause Analysis | Three contributor cards (mobile bounce surge, checkout funnel loss, desktop steady) with severity indicators |
| Recommended Actions | Numbered, prioritised list with projected impact and "Fix Now" / "View" CTAs |

**Data source:** Static mock (`insightData.ts`)

### 4.3 Action Result (`/insight/performance-drop/action`)

**Purpose:** Let users apply a fix and see projected impact — building trust that insights lead to outcomes.

| Section | What it shows |
|---------|--------------|
| Action Header | Description of the recommended fix and what it will do |
| Expected Impact (3 cards) | Before → After projections (bounce rate, load time, conversions) |
| Action Steps | Numbered list of specific changes that will be applied |
| Apply Button | Triggers a 2-second simulated application with progress bar |
| Success State | Confirmation with applied changes list, projected metrics, and "What's Next" guidance |

**Data source:** Static mock (`actionData.ts`)

### 4.4 Drop-off Analysis (`/drop-off`)

**Purpose:** Visualise where users abandon the e-commerce conversion funnel.

- Insight summary cards (biggest drop-off, checkout friction, mobile drop-off)
- Horizontal funnel bar chart with progressive visitor loss
- Step-by-step breakdown table (visitors, drop-off count, retention rate)

**Data source:** Static mock (`dropOffData.ts`) — future: `funnel_events` table

### 4.5 User Segments (`/segments`)

**Purpose:** Compare engagement metrics across audience cohorts.

- Segment cards (Power Users, Mobile Visitors, Desktop, International, Returning) with bounce rate and avg. session
- Age demographics horizontal bar chart

**Data source:** Static mock (`segmentsData.ts`) — future: `user_segments` table

### 4.6 Funnels List (`/funnels`)

**Purpose:** Browse all tracked conversion funnels at a glance.

- Funnel cards with mini bar chart previews, conversion rate, and trend indicator
- Click-through to Funnel Detail

**Data source:** Static mock (`funnelsData.ts`) — future: `saved_funnels` table

### 4.7 Funnel Detail Analysis (`/funnels/detail`)

**Purpose:** Deep-dive into a single funnel with segment and step-level breakdowns.

- KPI row (overall conversion, total users, avg. time to convert, biggest drop-off step)
- Funnel step conversion bar chart (with worst step highlighted in red)
- Drop-off by step panel with colour-coded severity bars
- Segment breakdown table (traffic source × funnel step)
- AI-generated recommended actions with severity badges and projected impact

**Data source:** Static mock (`funnelDetailData.ts`) — future: `funnel_events` + `saved_funnels`

### 4.8 Page Performance (`/pages`)

**Purpose:** Identify which pages perform well and which need attention.

- Summary KPIs (total pages, total views, avg. bounce rate)
- Full page table with colour-coded bounce rates and trend arrows

**Data source:** Static mock (`pagesData.ts`) — future: `page_analytics` table (already seeded)

### 4.9 Reports (`/reports`)

**Purpose:** Access generated reports and manage scheduled automations.

- Summary cards (total reports, scheduled count, last generated time)
- Recent reports table with type badges and download actions
- Scheduled reports list with next-run dates

**Data source:** Static mock (`reportsData.ts`) — future: `saved_reports` + `scheduled_reports`

### 4.10 Settings (`/settings`)

**Purpose:** Manage profile, appearance (dark mode), notification preferences, and account.

**Data source:** Theme persisted via `next-themes`; other settings partially static

### 4.11 Not Found (`/*`)

**Purpose:** 404 error page with link back to dashboard.

---

## 5. User Flow

The prototype tests one primary flow — the **Insight → Analysis → Action** loop:

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Dashboard Overview                                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  "Performance dropped 15% — mobile bounce surged"   │    │
│  │  [Fix Checkout Drop-off]  [Analyze Root Cause]      │    │
│  └──────────────┬──────────────────────┬───────────────┘    │
│                 │                      │                     │
│                 ▼                      ▼                     │
│       Insight Detail           (or direct to action)        │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  What caused this? (3 root causes)                  │    │
│  │  Recommended Actions:                               │    │
│  │    1. Optimize mobile landing page  [Fix Now] ──────┼──┐ │
│  │    2. Simplify checkout flow        [View]          │  │ │
│  │    3. Add exit-intent popup         [View]          │  │ │
│  └─────────────────────────────────────────────────────┘  │ │
│                                                            │ │
│                 ┌──────────────────────────────────────────┘ │
│                 ▼                                            │
│       Action Result                                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Expected impact: 72% → ~55% bounce                 │    │
│  │  3 changes to apply                                 │    │
│  │  [Apply All Changes]                                │    │
│  │         │                                           │    │
│  │         ▼                                           │    │
│  │  ✓ Changes Applied Successfully                     │    │
│  │  Monitor for 7 days → Review checkout funnel next   │    │
│  │  [Back to Dashboard]  [Undo Changes]                │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Secondary flows:**

- Dashboard → Drop-off Analysis (detailed funnel view)
- Dashboard → Funnels List → Funnel Detail → Apply All Fixes → Action Result
- Dashboard → Pages / Segments / Reports (exploration)
- Any screen → Settings (sidebar)

---

## 6. Product Hypothesis

> **If** we surface a single, prioritised, actionable insight at the top of the dashboard (instead of showing 12 charts),  
> **then** users will understand their performance status faster and take corrective action,  
> **resulting in** increased engagement (CTR on insights from 10% → 25%) and increased trust in the product.

### What This Prototype Tests

1. **Do users understand the insight?** — Can they articulate what the problem is after seeing the dashboard?
2. **Do users act on the insight?** — Do they click "Fix Checkout Drop-off" or "Analyze Root Cause"?
3. **Does the 3-screen flow build trust?** — After completing the Insight → Analysis → Action loop, do users feel confident the product helped them?

---

## 7. Key Success Metrics

| Metric | Current (Baseline) | Target | Measurement |
|--------|-------------------|--------|-------------|
| Insight CTR | 10% | 25% | Clicks on primary insight card / dashboard views |
| Time to first insight | Unknown (too long) | < 10 seconds | Time from page load to first meaningful interaction |
| First-visit bounce rate | 60% | < 40% | Users who leave without any interaction |
| Action completion rate | N/A (new) | > 30% | Users who reach Action Result / users who view Insight Detail |
| Return visit rate | Unknown | > 50% weekly | Users who return within 7 days |
| NPS / trust score | Unknown | > 40 | Post-action survey |

---

## 8. Data Architecture

### Current state: Mock → Live migration

The project has evolved through three stages:

| Stage | Description | Status |
|-------|-------------|--------|
| **Stage 1: Static Prototype** | All data from `features/*/data/*.ts` files | ✅ Complete (legacy) |
| **Stage 2: Seeded Database** | Sample data in Supabase tables, React Query hooks, Dashboard Overview live | ✅ Current |
| **Stage 3: Production Pipeline** | External analytics ingestion → DB → aggregation → all UI screens | 🔜 Future |

### Database tables and current usage

| Table | Purpose | Seeded? | Queried by UI? |
|-------|---------|---------|----------------|
| `analytics_events` | Raw events (sessions, bounces, conversions, pageviews) | ✅ Yes | ✅ Dashboard KPIs + DAU |
| `page_analytics` | Aggregated per-page metrics | ✅ Yes | ✅ Top Drop-off Pages |
| `insights` | AI-generated insight cards | ✅ Partially | ⚠️ Not yet wired |
| `insight_actions` | Recommended actions per insight | Schema only | ❌ Mock data |
| `funnel_events` | Step-level funnel tracking | Schema only | ❌ Mock data |
| `saved_funnels` | User-defined funnel definitions | Schema only | ❌ Mock data |
| `user_segments` | Cohort/segment definitions | Schema only | ❌ Mock data |
| `saved_reports` | Generated report configurations | Schema only | ❌ Mock data |
| `scheduled_reports` | Report scheduling metadata | Schema only | ❌ Mock data |
| `profiles` | User profile data | Via auth | ✅ Auth flow |
| `dashboard_preferences` | Per-user layout/date-range prefs | Schema only | ⚠️ Limited |

### Static data files still in use

| File | Used by | Migration target |
|------|---------|-----------------|
| `features/dashboard/data/dashboardData.ts` | Insight cards (partially) | `insights` table |
| `features/drop-off/data/dropOffData.ts` | Drop-off Analysis screen | `funnel_events` |
| `features/segments/data/segmentsData.ts` | User Segments screen | `user_segments` |
| `features/funnels/data/funnelsData.ts` | Funnels List screen | `saved_funnels` |
| `features/funnels/data/funnelDetailData.ts` | Funnel Detail screen | `funnel_events` + `saved_funnels` |
| `features/pages-analytics/data/pagesData.ts` | Page Performance screen | `page_analytics` |
| `features/reports/data/reportsData.ts` | Reports screen | `saved_reports` + `scheduled_reports` |
| `features/insights/data/insightData.ts` | Insight Detail screen | `insights` |
| `features/insights/data/actionData.ts` | Action Result screen | `insight_actions` |

---

## 9. Technical Architecture

### Current State (Hybrid: seeded DB + static mock)

```
┌──────────────────────────────────────────────────────────┐
│                     Client (SPA)                         │
│                                                          │
│  React 18 + TypeScript + Vite                            │
│                                                          │
│  ┌────────────────────────────────────────────────────┐   │
│  │  Dashboard Overview                               │   │
│  │  KPI cards ──── React Query ──── Supabase DB      │   │
│  │  DAU chart ──── React Query ──── Supabase DB      │   │
│  │  Drop-offs ──── React Query ──── Supabase DB      │   │
│  │  Insights  ──── static data/*.ts (partially)      │   │
│  └────────────────────────────────────────────────────┘   │
│                                                          │
│  ┌────────────────────────────────────────────────────┐   │
│  │  All Other Screens                                │   │
│  │  Drop-off / Segments / Funnels / Pages / Reports  │   │
│  │  ──── static features/*/data/*.ts                 │   │
│  └────────────────────────────────────────────────────┘   │
│                                                          │
│  Auth: Lovable Cloud / Supabase Auth                     │
│  RLS: auth.uid() = user_id on all tables                 │
└──────────────────────────────────────────────────────────┘
```

### Target State (Production)

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Client    │────▶│   API Layer      │────▶│   Database       │
│   (SPA)     │     │   (Edge Fns)     │     │   (PostgreSQL)   │
│             │◀────│                  │◀────│                  │
└─────────────┘     └────────┬─────────┘     └──────────────────┘
                             │
                    ┌────────▼─────────┐
                    │  Insight Engine  │
                    │  (Anomaly Det.   │
                    │   + LLM Copy)    │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  Event Pipeline  │
                    │  (SDK → Ingest)  │
                    └──────────────────┘
```

### Key Libraries

| Library | Purpose |
|---------|---------|
| React 18 | UI framework |
| React Router 6 | Client-side routing |
| React Query | Server-state management and caching |
| Recharts | Charts and data visualisation |
| Tailwind CSS | Styling with semantic design tokens |
| shadcn/ui (Radix) | Accessible component primitives |
| next-themes | Light/dark mode |
| date-fns | Date manipulation (date range filter) |
| Supabase JS | Database client (auto-configured by Lovable Cloud) |

---

## 10. Module 5 Implementation Update

### What was delivered

- ✅ Seeded sample analytics data inserted into `analytics_events`
- ✅ Seeded page-level data inserted into `page_analytics`
- ✅ React Query hooks created (`useDashboardData.ts`) for all dashboard metrics
- ✅ Daily Active Users chart connected to live database queries
- ✅ Top Drop-off Pages connected to live database queries
- ✅ Dashboard KPI cards (Total Sessions, Bounce Rate, Avg Duration, Conversion Rate) render from DB
- ✅ Dashboard metrics update dynamically when new database records are inserted
- ✅ Query logic updated to use aggregate functions after row-limit issue was discovered
- ✅ Loading, empty, and error states added to all dashboard data components

### Key files changed

| File | Change |
|------|--------|
| `src/hooks/useDashboardData.ts` | New React Query hooks for all dashboard metrics |
| `src/features/dashboard/DashboardOverview.tsx` | Wired to live queries instead of static imports |
| `src/components/charts/DailyActiveUsersChart.tsx` | Connected to DB via React Query |
| `src/components/charts/TopDropOffPages.tsx` | Connected to DB via React Query |
| `src/features/dashboard/components/MetricCard.tsx` | Added loading/error/empty states |
| `src/components/feedback/CardSkeleton.tsx` | Skeleton loading component |
| `src/components/feedback/CardEmptyState.tsx` | Empty state component |
| `src/components/feedback/CardErrorState.tsx` | Error state with retry button |

### Issues discovered and resolved

| Issue | Resolution |
|-------|-----------|
| Supabase default 1000-row limit hid new records | Switched to aggregate queries (`COUNT`, `AVG`) instead of fetching all rows |
| Partial migration confusion | Documented clearly which screens are live vs. static |

### Remaining work

- [ ] Connect `insights` table to dashboard insight cards
- [ ] Connect `funnel_events` to Drop-off Analysis and Funnel Detail screens
- [ ] Connect `user_segments` to User Segments screen
- [ ] Connect `page_analytics` to Page Performance table (full table view)
- [ ] Connect `saved_reports` / `scheduled_reports` to Reports screen
- [ ] Connect `dashboard_preferences` to Settings persistence
- [ ] Build ingestion API (Edge Function) for external analytics data
- [ ] Add date-range filtering to all database queries
- [ ] Implement data aggregation layer for production-scale queries

---

## 11. Recommended Next Steps

### Phase 1 — Validate Prototype (Weeks 1–2) ✅ Complete

- [x] Usability testing — Run 5–8 moderated sessions with target users on the current prototype
- [x] Measure baseline — Track insight CTR, time-to-first-click, and completion of the 3-screen flow
- [x] Iterate on copy — Refine insight headlines and CTA labels based on user feedback
- [x] Mobile responsiveness — Test and fix layouts on 375px–768px viewports

### Phase 2 — Backend Foundation (Weeks 3–6) ✅ In Progress

- [x] **Enable Lovable Cloud** — Authentication, database, and RLS provisioned
- [x] **User auth** — Sign-up/login flow connected
- [x] **Analytics data model** — Schema designed and provisioned (11 tables)
- [x] **Seed data** — Sample records inserted into `analytics_events` and `page_analytics`
- [x] **Dashboard Overview wired** — KPI cards, DAU chart, Top Drop-off Pages live
- [ ] **Wire remaining screens** — Migrate static data to DB queries screen by screen
- [ ] **Date range filtering** — Wire DateRangeFilter component to query parameters

### Phase 3 — Data Pipeline (Weeks 5–8)

- [ ] **JS tracking SDK** — Lightweight snippet customers embed in their product
- [ ] **Event ingestion** — Edge function to receive and store events
- [ ] **Funnel computation** — Background job to calculate conversion rates per funnel definition
- [ ] **Aggregation layer** — Pre-compute KPIs (sessions, bounce rate, DAU) for fast dashboard loads

### Phase 4 — Insight Engine (Weeks 7–10)

- [ ] **Anomaly detection** — Statistical model to detect metric changes (z-score or Prophet-based)
- [ ] **Insight ranking** — Severity scoring algorithm (impact × confidence × recency)
- [ ] **Natural language generation** — LLM integration to produce insight headlines and descriptions
- [ ] **Recommendation engine** — Rule-based + ML suggestions for fixing identified issues

### Phase 5 — Production Polish (Weeks 9–12)

- [ ] **Real-time updates** — WebSocket or polling for live metric changes
- [ ] **Scheduled reports** — Email delivery of PDF reports
- [ ] **Notification system** — In-app + email alerts for metric spikes
- [ ] **Action execution** — Integration with feature flags / deployment tools
- [ ] **Audit log** — Track what actions were applied and their measured impact
- [ ] **Role-based access** — Admin, editor, viewer permissions

---

## Appendix: Design System Summary

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--background` | White | Near-black | Page background |
| `--card` | White | Dark slate | Card surfaces |
| `--primary` | Blue (210°) | Blue (210°) | CTAs, active states |
| `--destructive` | Red | Red | Alerts, negative trends |
| `--chart-success` | Green | Green | Positive trends |
| `--chart-warning` | Amber | Amber | Warnings, medium severity |
| `--chart-alert` | Red | Red | Critical chart indicators |

Card component: `.asana-card` utility class (rounded border, subtle shadow, card background).

Typography scale: 11px (labels) → 12px (metadata) → 13px (body) → 15px (section heads) → 20–28px (hero numbers).

---

*This is a living document. Update as the product evolves through validation, backend integration, and production deployment.*
