# Bounce — Engineering Handoff Document

> **Version:** 1.2  
> **Date:** April 3, 2026  
> **Audience:** Engineering team  
> **Companion doc:** [`livingprd.md`](./livingprd.md)

---

## 1. System Overview

Bounce is an analytics dashboard SPA that surfaces actionable insights from user engagement data. The project has evolved beyond a static front-end prototype into a **seeded full-stack demo environment** backed by Lovable Cloud / Supabase.

The current implementation uses **database-backed seed data** for key dashboard metrics and visualizations. Dashboard Overview KPI cards, Daily Active Users, and Top Drop-off Pages now read from **live database queries** instead of static TypeScript constants. Other screens are still partially or fully backed by mock data and remain to be migrated.

**Migration trajectory:**  
`Static prototype → Seeded database → Live queries → Full-stack demo (in progress)`

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
- Database schema exists and is provisioned
- Seeded analytics data exists in the database
- Dashboard Overview KPI metrics now read from live database queries
- Daily Active Users chart now reads from live database queries
- Top Drop-off Pages now reads from live database queries
- Insight cards and most secondary screens are still using static mock data
- The project is currently in a hybrid migration state: partially live, partially static

---

## 2. Main Features

| # | Feature | Route | Status |
|---|---------|-------|--------|
| 1 | Dashboard Overview (KPIs, insights, DAU chart) | `/` | **Partially live:** KPI cards, DAU, and Top Drop-off Pages use DB queries; insight cards still partially static |
| 2 | Insight Detail (root-cause analysis, recommendations) | `/insight/performance-drop` | UI complete, mostly mock/static |
| 3 | Action Result (apply fix, projected impact) | `/insight/performance-drop/action` | UI complete, mock/static |
| 4 | Drop-off Analysis (funnel visualisation) | `/drop-off` | UI complete, mock/static |
| 5 | User Segments (cohort cards, demographics) | `/segments` | UI complete, mock/static |
| 6 | Funnels List (all tracked funnels) | `/funnels` | UI complete, mock/static |
| 7 | Funnel Detail (step chart, segment table, AI recs) | `/funnels/detail` | UI complete, mock/static |
| 8 | Page Performance (per-page metrics table) | `/pages` | UI complete, mock/static |
| 9 | Reports (generated + scheduled) | `/reports` | UI complete, mock/static |
| 10 | Settings (profile, theme, notifications) | `/settings` | UI complete, limited persistence |
| 11 | 404 page | `/*` | Complete |

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

The data architecture has progressed through three stages:

### Stage 1 — Static Prototype (completed)

```text
src/features/*/data/*.ts  →  React component  →  UI
```

All metrics, charts, and tables rendered from hardcoded TypeScript constants. No database involved.

### Stage 2 — Seeded Database (current)

```text
Seed SQL  →  Supabase tables  →  React Query hooks  →  Dashboard Overview UI
```

Sample analytics data has been inserted into `analytics_events` and `page_analytics`. React Query hooks (`useDashboardData`) fetch aggregated metrics from the database. The Dashboard Overview screen (KPI cards, DAU chart, Top Drop-off Pages) now renders live query results. Other screens still use Stage 1 static data.

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
| `analytics_events` | Raw event data (sessions, pageviews, bounces, conversions) | **Seeded & queried** — powers KPI metrics and DAU chart |
| `page_analytics` | Aggregated per-page performance metrics | **Seeded & queried** — powers Top Drop-off Pages |
| `insights` | AI-generated insight cards | Schema ready, partially seeded; future dashboard insight cards |
| `insight_actions` | Recommended actions per insight | Schema ready, not yet queried by UI |
| `funnel_events` | Step-level funnel tracking data | Schema ready; future drop-off analysis |
| `saved_funnels` | User-defined funnel definitions | Schema ready, mock data in UI |
| `user_segments` | Cohort/segment definitions | Schema ready, mock data in UI |
| `page_analytics` | Per-page metrics (views, bounce, duration) | **Seeded & queried** |
| `saved_reports` | Generated report configurations | Schema ready, mock data in UI |
| `scheduled_reports` | Report scheduling metadata | Schema ready, mock data in UI |
| `profiles` | User profile data | Schema ready, used by auth |
| `dashboard_preferences` | Per-user layout and date-range prefs | Schema ready, limited use |

### Key queries powering the Dashboard Overview

- **Total Sessions:** `COUNT(DISTINCT session_id)` from `analytics_events`
- **Bounce Rate:** `COUNT(event_type = 'bounce') / COUNT(DISTINCT session_id)` from `analytics_events`
- **Avg. Session Duration:** `AVG(duration_ms)` from `analytics_events`
- **Conversion Rate:** `COUNT(event_type = 'conversion') / COUNT(DISTINCT session_id)` from `analytics_events`
- **Daily Active Users:** `COUNT(DISTINCT session_id) GROUP BY date` from `analytics_events`
- **Top Drop-off Pages:** aggregated from `page_analytics` ordered by `bounce_count DESC`

---

## 6. Auth & RLS Model

- Authentication via Lovable Cloud (Supabase Auth)
- All data tables enforce Row-Level Security (RLS)
- Policy pattern: `auth.uid() = user_id` on all user-owned tables
- Security definer functions (`owns_funnel`, `owns_insight`) prevent RLS recursion on cross-table lookups
- `analytics_events` and `page_analytics` use broader read policies for dashboard aggregation

---

## 7. Technical Risks

| Risk | Severity | Notes |
|------|----------|-------|
| Query row limit (1000 default) caused new records to not appear in metrics | **Resolved** | Switched to aggregate queries (`COUNT`, `AVG`) instead of fetching all rows |
| Partial live-data migration | Medium | Only Dashboard Overview is wired to DB; other screens still use static data |
| Seeded data instead of real ingestion | Low (demo) | Acceptable for demo; production requires ingestion pipeline |
| No pagination on large datasets | Medium | Aggregate queries mitigate this for now; will need pagination for event-level views |
| Mock data drift | Low | Static `data/*.ts` files may diverge from DB schema as tables evolve |

---

## 8. Module 5 Implementation Update

### What was done

- ✅ Seeded sample analytics data inserted into `analytics_events` (sessions, bounces, conversions, pageviews)
- ✅ Seeded page-level data inserted into `page_analytics` (views, bounce counts, durations)
- ✅ React Query hooks created in `useDashboardData.ts` for all dashboard metrics
- ✅ Daily Active Users chart connected to live database queries
- ✅ Top Drop-off Pages widget connected to live database queries
- ✅ Dashboard KPI cards (Total Sessions, Bounce Rate, Avg Duration, Conversion Rate) now render from DB
- ✅ Dashboard metrics update dynamically when new database records are inserted
- ✅ Query logic updated to use aggregate functions after row-limit issue was discovered and resolved
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

### Remaining work

- [ ] Connect `insights` table to dashboard insight cards
- [ ] Connect `funnel_events` to Drop-off Analysis and Funnel Detail screens
- [ ] Connect `user_segments` to User Segments screen
- [ ] Connect `page_analytics` to Page Performance table
- [ ] Connect `saved_reports` / `scheduled_reports` to Reports screen
- [ ] Connect `dashboard_preferences` to Settings persistence
- [ ] Build ingestion API (Edge Function) for external analytics data
- [ ] Add date-range filtering to all database queries
- [ ] Implement data aggregation layer for production-scale queries

---

## 9. Known Gaps

| Gap | Priority | Notes |
|-----|----------|-------|
| No real analytics ingestion pipeline | High | Required for production |
| Secondary screens still use mock data | Medium | Systematic migration needed |
| No date-range filtering on DB queries | Medium | DateRangeFilter component exists but not wired to queries |
| No data export functionality | Low | Reports screen is UI-only |
| Settings persistence is limited | Low | Theme works; other preferences not fully saved |

---

## 10. Extension Path

1. **Connect remaining screens** — Migrate each screen from static `data/*.ts` to React Query + Supabase, following the Dashboard Overview pattern
2. **Build ingestion Edge Function** — Accept analytics events via POST, validate, and insert into `analytics_events`
3. **Add aggregation views** — Create Postgres views or materialized views for expensive queries
4. **Wire date-range filter** — Pass date parameters from `DateRangeFilter` component into all React Query hooks
5. **Real-time updates** — Enable Supabase Realtime on key tables for live dashboard refresh
