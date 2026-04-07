# Bounce — Engineering Handoff Document

> **Version:** 2.0  
> **Date:** April 5, 2026  
> **Audience:** Engineering team  
> **Companion doc:** [`livingprd.md`](./livingprd.md)

---

## 1. System Overview

Bounce is an analytics dashboard SPA that surfaces actionable insights from user engagement data. The project has evolved from a static front-end prototype into a **seeded full-stack analytics demo** backed by Lovable Cloud / Supabase.

The vast majority of screens now read from **live database queries** via React Query hooks. Dashboard Overview, Drop-off Analysis, Funnels (list + detail), Pages, Reports, and User Segments are all database-backed. Only a small number of secondary UI elements (demographics chart, AI recommendations) remain static.

**Migration trajectory:**  
`Static prototype → Seeded database → Live queries → Full-stack demo (current)`

### Current stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS + shadcn/ui (Radix) |
| Charts | Recharts |
| Routing | React Router |
| State/Fetching | React Query |
| Backend | Lovable Cloud / Supabase (Postgres + Auth + RLS) |
| Theming | next-themes (light/dark) |
| Hosting | Lovable Cloud |

### Current implementation state

- Authentication is connected through Lovable Cloud / Supabase
- Database schema exists and is fully provisioned with seed data
- **All major screens** now use live database queries instead of static mock data
- DateRangeFilter is wired to Dashboard Overview and Pages queries
- The project is a **seeded database-backed analytics demo** with minimal remaining static elements

---

## 2. Main Features

| # | Feature | Route | Status |
|---|---------|-------|--------|
| 1 | Dashboard Overview (KPIs, insights, DAU chart) | `/` | **Live:** KPI cards, DAU, Top Drop-off, Insights — all DB-backed + date range filtering |
| 2 | Insight Detail (root-cause analysis, recommendations) | `/insight/performance-drop` | UI complete, mostly static |
| 3 | Action Result (apply fix, projected impact) | `/insight/performance-drop/action` | UI complete, static |
| 4 | Drop-off Analysis (funnel visualisation) | `/drop-off` | **Live:** funnel steps and insights from `funnel_events` |
| 5 | User Segments (cohort cards, demographics) | `/segments` | **Live:** segment cards from `user_segments`; demographics chart static |
| 6 | Funnels List (all tracked funnels) | `/funnels` | **Live:** funnel list from `saved_funnels` + `funnel_events` |
| 7 | Funnel Detail (step chart, segment table, AI recs) | `/funnels/detail?id=` | **Live:** steps + segments from DB; AI recommendations static |
| 8 | Page Performance (per-page metrics table) | `/pages` | **Live:** metrics from `page_analytics` + date range filtering |
| 9 | Reports (generated + scheduled) | `/reports` | **Live:** from `saved_reports` + `scheduled_reports` |
| 10 | Settings (profile, theme, notifications) | `/settings` | UI complete, limited persistence |
| 11 | 404 page | `/*` | Complete |

### Screen status summary

| Category | Screens |
|----------|---------|
| **Fully live (DB-backed)** | Dashboard Overview, Drop-off Analysis, Funnels List, Funnel Detail (steps + segments), Pages, Reports, User Segments (cards) |
| **Partially static** | Funnel Detail (AI recommendations), User Segments (demographics chart), Settings (theme only) |
| **Still static** | Insight Detail, Action Result |

---

## 3. User Flow

```text
Dashboard ─── "Fix Checkout Drop-off" ───▶ Insight Detail
    │                                            │
    │                                     "Fix Now"
    │                                            │
    │                                            ▼
    │                                      Action Result
    │                                     [Apply Changes]
    │                                            │
    │                                     ✓ Success
    │                                     [Back to Dashboard]
    │
    ├── Drop-off Analysis
    ├── Funnels List ──▶ Funnel Detail ──▶ Action Result
    ├── User Segments
    ├── Pages
    ├── Reports
    └── Settings
```

---

## 4. Data Flow

### Stage 1 — Static Prototype (completed)

```text
src/features/*/data/*.ts  →  React component  →  UI
```

All metrics, charts, and tables rendered from hardcoded TypeScript constants. No database involved.

### Stage 2 — Seeded Database + Live Queries (current)

```text
Seed SQL  →  Supabase tables  →  React Query hooks  →  All major UI screens
```

Sample analytics data has been inserted into all major tables. React Query hooks fetch aggregated metrics from the database. Most screens now render live query results with loading, empty, and error states. Date range filtering is active on Dashboard Overview and Pages.

### Stage 3 — Production Ingestion Pipeline (future)

```text
External analytics source  →  Ingestion API / Edge Function  →  Supabase tables
  →  Aggregation (views / cron)  →  React Query  →  All UI screens
```

Real user events will be ingested via an API endpoint, stored in the same table schema, aggregated for performance, and served to all dashboard screens.

---

## 5. Database Schema

### Tables currently in use

| Table | Purpose | Current state |
|-------|---------|---------------|
| `analytics_events` | Raw event data (sessions, pageviews, bounces, conversions) | **Seeded & queried** — powers KPI metrics, DAU chart; date-range filtered |
| `page_analytics` | Aggregated per-page performance metrics | **Seeded & queried** — powers Top Drop-off Pages, Pages screen; date-range filtered |
| `insights` | AI-generated insight cards | **Seeded & queried** — powers Dashboard Overview insight cards |
| `insight_actions` | Recommended actions per insight | Schema ready, not yet queried by UI |
| `funnel_events` | Step-level funnel tracking data | **Seeded & queried** — powers Drop-off Analysis, Funnels List, Funnel Detail |
| `saved_funnels` | User-defined funnel definitions | **Seeded & queried** — powers Funnels List + Funnel Detail |
| `user_segments` | Cohort/segment definitions | **Seeded & queried** — powers User Segments screen (cards) |
| `saved_reports` | Generated report configurations | **Seeded & queried** — powers Reports screen |
| `scheduled_reports` | Report scheduling metadata | **Seeded & queried** — powers Reports scheduled section |
| `profiles` | User profile data | Schema ready, used by auth |
| `dashboard_preferences` | Per-user layout and date-range prefs | Schema ready, limited use |

### Key queries powering the application

| Query | Source table(s) | Used by |
|-------|----------------|---------|
| `COUNT(DISTINCT session_id)` | `analytics_events` | Dashboard KPI (Total Sessions) |
| Bounce rate from `duration_ms < 60000` | `analytics_events` | Dashboard KPI (Bounce Rate) |
| `AVG(duration_ms)` | `analytics_events` | Dashboard KPI (Avg. Session) |
| Conversion from `event_type = 'conversion'` | `analytics_events` | Dashboard KPI (Conversion Rate) |
| `COUNT(DISTINCT session_id) GROUP BY date` | `analytics_events` | DAU chart |
| Aggregated `views`, `bounce_count` by `page_path` | `page_analytics` | Top Drop-off Pages, Pages screen |
| `COUNT(DISTINCT session_id) GROUP BY step_index` | `funnel_events` | Drop-off Analysis, Funnels List, Funnel Detail |
| `COUNT(DISTINCT session_id) GROUP BY step_index, source` | `funnel_events` | Funnel Detail segment breakdown |
| Top 10 by `created_at DESC`, mapped by `severity` | `insights` | Dashboard insight cards |
| `SELECT id, name, steps` | `saved_funnels` | Funnels List, Funnel Detail |
| `SELECT title, report_type, created_at` | `saved_reports` | Reports screen |
| `SELECT frequency, next_run_at, is_active` | `scheduled_reports` | Reports scheduled section |
| `SELECT name, icon_key, color_class, filter_rules` | `user_segments` | User Segments cards |

---

## 6. Auth & RLS Model

- Authentication via Lovable Cloud (Supabase Auth)
- All data tables enforce Row-Level Security (RLS)
- Policy pattern: `auth.uid() = user_id` on all user-owned tables
- **Demo-friendly read policies** added to: `analytics_events`, `page_analytics`, `insights`, `funnel_events`, `saved_funnels`, `saved_reports`, `scheduled_reports`, `user_segments` — allows any authenticated user to read seeded data
- Security definer functions (`owns_funnel`, `owns_insight`) prevent RLS recursion on cross-table lookups

### Route Protection

All dashboard routes are wrapped in `ProtectedRoute`, which enforces authentication before any feature interaction:

| Protected route | Feature |
|----------------|---------|
| `/` | Dashboard Overview |
| `/drop-off` | Drop-off Analysis |
| `/funnels` | Funnels List |
| `/funnels/detail` | Funnel Detail |
| `/pages` | Pages |
| `/reports` | Reports |
| `/segments` | User Segments |
| `/settings` | Settings |

- Unauthenticated users are redirected to `/auth` automatically
- The intended destination is preserved in router state (`location.state.from`) for potential post-login redirect
- A loading spinner is shown during auth initialization to prevent flash of redirect
- The `/auth` page displays a `ShieldAlert` banner ("Please sign in to access the dashboard") when redirected from a protected route
- Key files: `ProtectedRoute.tsx`, `AuthPage.tsx`

---

## 7. Date Range Filtering

The `DateRangeFilter` component is now wired to live queries on two screens:

| Screen | Hooks affected | Date field used |
|--------|---------------|-----------------|
| Dashboard Overview | `useDashboardMetrics`, `useDailyActiveUsers`, `useTopDropOffPages` | `analytics_events.created_at`, `page_analytics.date` |
| Pages | `usePageAnalytics` | `page_analytics.date` |

- Default range: last 14 days
- Presets: 7d, 14d, 30d + custom calendar picker
- Comparison period for KPI change % is auto-calculated (equal span before selected range)
- Other screens (Funnels, Reports, Segments) do not yet use date filtering

---

## 8. Technical Risks & Limitations

| Risk | Severity | Notes |
|------|----------|-------|
| Query row limit (1000 default) | **Resolved** | All hooks use paginated fetching or aggregate queries |
| Seeded data instead of real ingestion | Low (demo) | Acceptable for demo; production requires ingestion pipeline |
| Partial static data remains | Low | Demographics chart, AI recommendations, Insight Detail / Action Result screens |
| Date filtering not applied to all screens | Medium | Only Dashboard + Pages; Funnels, Reports, Segments still unfiltered |
| No data export functionality | Low | Reports screen is UI-only (no download) |
| Settings persistence is limited | Low | Theme works; other preferences not fully saved |
| Query performance at scale | Medium | Client-side aggregation works for demo data; production needs DB-level aggregation |

---

## 9. Implementation Log

### Module 5 — Initial DB migration

- ✅ Seeded `analytics_events` with sessions, bounces, conversions, pageviews
- ✅ Seeded `page_analytics` with per-page views, bounce counts, durations
- ✅ Created `useDashboardData.ts` hooks for KPIs, DAU, Top Drop-off
- ✅ Dashboard Overview KPI cards, DAU chart, Top Drop-off Pages wired to DB
- ✅ Row-limit issue discovered and resolved (switched to paginated fetching)
- ✅ Loading, empty, and error states added to all data components

### Module 5 — Extended migrations

- ✅ Insight cards connected to `insights` table via `useInsights` hook (3 seeded records)
- ✅ Drop-off Analysis connected to `funnel_events` via `useDropOffData` hook (~2,659 records seeded)
- ✅ Pages screen connected to `page_analytics` via `usePageAnalytics` hook (8 pages, 10 days seeded)
- ✅ Funnels List connected to `saved_funnels` + `funnel_events` via `useFunnelsList` hook (3 funnels seeded)
- ✅ Funnel Detail connected to `saved_funnels` + `funnel_events` via `useFunnelDetail` hook (steps + segment breakdown by `source`)
- ✅ Reports screen connected to `saved_reports` + `scheduled_reports` via `useReports` hook (6 reports + 2 schedules seeded)
- ✅ User Segments connected to `user_segments` via `useSegments` hook (5 segments seeded with metrics in `filter_rules`)
- ✅ DateRangeFilter wired to Dashboard Overview and Pages queries
- ✅ Demo-friendly RLS read policies added to all seeded tables
- ✅ Funnel events updated with `source` values for segment breakdown analysis

### Key files created / changed

| File | Change |
|------|--------|
| `src/hooks/useDashboardData.ts` | Dashboard metrics, DAU, drop-off — now with date range params |
| `src/hooks/useInsights.ts` | Insight cards from `insights` table |
| `src/hooks/useDropOffData.ts` | Drop-off funnel from `funnel_events` |
| `src/hooks/usePageAnalytics.ts` | Page metrics from `page_analytics` — with date range params |
| `src/hooks/useFunnelsList.ts` | Funnels list from `saved_funnels` + `funnel_events` |
| `src/hooks/useFunnelDetail.ts` | Funnel detail steps + segments from DB |
| `src/hooks/useReports.ts` | Reports + schedules from `saved_reports` / `scheduled_reports` |
| `src/hooks/useSegments.ts` | Segment cards from `user_segments` |
| `src/features/dashboard/DashboardOverview.tsx` | Live queries + DateRangeFilter |
| `src/features/drop-off/DropOffAnalysis.tsx` | Live funnel queries |
| `src/features/funnels/FunnelsList.tsx` | Live funnels list, passes `?id=` on navigate |
| `src/features/funnels/FunnelDetailAnalysis.tsx` | Live steps + segments; static recs retained |
| `src/features/pages-analytics/PagePerformance.tsx` | Live page metrics + DateRangeFilter |
| `src/features/reports/ReportsOverview.tsx` | Live reports + schedules |
| `src/features/segments/UserSegments.tsx` | Live segment cards; static demographics |
| `src/components/charts/DailyActiveUsersChart.tsx` | Accepts `range` prop |
| `src/components/charts/TopDropOffPages.tsx` | Accepts `range` prop |
| `src/components/feedback/Card*.tsx` | Skeleton, empty, error state components |

---

## 10. Validation Notes

The following tests confirm that the database-backed system responds correctly to data changes:

| Test | Method | Result |
|------|--------|--------|
| Dashboard KPI metrics | Inserted 300 new `analytics_events` for today | Total Sessions increased on refresh ✅ |
| Insight cards | Updated an `insights` record with new title/severity | Card content changed on refresh ✅ |
| Drop-off funnel | Seeded `funnel_events` with step drop-off pattern | Step counts and drop-off % computed correctly ✅ |
| Pages metrics | Seeded `page_analytics` with 10 days of data | Views, bounce rates, trends computed correctly ✅ |
| Date range filtering | Switched between 7d/14d/30d presets | KPIs, DAU chart, Pages table all updated correctly ✅ |
| Funnels list | Seeded 3 funnels with different step counts | List rendered with correct conversion % ✅ |
| Reports | Seeded 6 reports + 2 schedules | Table and schedule list rendered correctly ✅ |
| Segments | Seeded 5 segments with metrics in `filter_rules` | Cards rendered with correct bounce/session data ✅ |

---

## 11. Known Gaps

| Gap | Priority | Notes |
|-----|----------|-------|
| No real analytics ingestion pipeline | High | Required for production |
| Insight Detail / Action Result still static | Medium | UI complete but not connected to DB |
| Date range filtering missing on Funnels, Reports, Segments | Medium | Only Dashboard + Pages are filtered |
| Demographics chart is static | Low | No demographics table exists |
| AI recommendations in Funnel Detail are static | Low | Would need AI integration or `insight_actions` table |
| No data export functionality | Low | Reports screen is UI-only |
| Settings persistence is limited | Low | Theme works; other preferences not fully saved |
| Static `data/*.ts` files still exist | Low | No longer imported by live screens; can be cleaned up |

---

## 12. Extension Path

1. **Connect remaining static screens** — Wire Insight Detail and Action Result to `insights` + `insight_actions` tables
2. **Extend date filtering** — Add date range to Funnels, Reports, and Segments queries
3. **Build ingestion Edge Function** — Accept analytics events via POST, validate, and insert into `analytics_events`
4. **Add aggregation views** — Create Postgres views or materialized views for expensive queries
5. **Clean up static data files** — Remove unused `data/*.ts` files from feature directories
6. **Real-time updates** — Enable Supabase Realtime on key tables for live dashboard refresh
7. **Settings persistence** — Wire `dashboard_preferences` to save layout and filter state
