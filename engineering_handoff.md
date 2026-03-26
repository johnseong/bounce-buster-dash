# Bounce — Engineering Handoff Document

> **Version:** 1.0  
> **Date:** March 26, 2026  
> **Audience:** Engineering team  
> **Companion doc:** [`livingprd.md`](./livingprd.md)

---

## 1. System Overview

Bounce is an analytics dashboard SPA that surfaces **actionable insights** from user engagement data. The prototype is fully client-side with static mock data; this document specifies everything needed to take it to production.

**Current stack:**

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS + shadcn/ui (Radix) |
| Charts | Recharts |
| Routing | React Router 6 (11 routes) |
| State/Fetching | React Query (installed, not yet wired) |
| Theming | next-themes (light/dark) |

**Current state:** No API calls, no auth, no database. All data lives in `src/features/*/data/*.ts` files.

---

## 2. Main Features

| # | Feature | Route | Status |
|---|---------|-------|--------|
| 1 | Dashboard Overview (KPIs, insights, DAU chart) | `/` | UI complete, mock data |
| 2 | Insight Detail (root-cause analysis, recommendations) | `/insight/performance-drop` | UI complete, mock data |
| 3 | Action Result (apply fix, projected impact) | `/insight/performance-drop/action` | UI complete, mock data |
| 4 | Drop-off Analysis (funnel visualisation) | `/drop-off` | UI complete, mock data |
| 5 | User Segments (cohort cards, demographics) | `/segments` | UI complete, mock data |
| 6 | Funnels List (all tracked funnels) | `/funnels` | UI complete, mock data |
| 7 | Funnel Detail (step chart, segment table, AI recs) | `/funnels/detail` | UI complete, mock data |
| 8 | Page Performance (per-page metrics table) | `/pages` | UI complete, mock data |
| 9 | Reports (generated + scheduled) | `/reports` | UI complete, mock data |
| 10 | Settings (profile, theme, notifications) | `/settings` | UI complete, no persistence |
| 11 | 404 page | `/*` | Complete |

---

## 3. User Flow

```
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

**Primary flow:** Dashboard → Insight Detail → Action Result (the "Insight → Analysis → Action" loop).  
**Secondary flows:** Sidebar navigation to any analytics screen.

---

## 4. Component Responsibilities

### Layout Shell

| Component | File | Responsibility |
|-----------|------|---------------|
| `DashboardLayout` | `src/components/layout/DashboardLayout.tsx` | Page wrapper with sidebar + content area |
| `DashboardSidebar` | `src/components/layout/DashboardSidebar.tsx` | Collapsible sidebar with grouped nav links |
| `NavLink` | `src/components/layout/NavLink.tsx` | Active-state-aware navigation link |
| `PageTransitionLoader` | `src/components/layout/PageTransitionLoader.tsx` | Loading bar on route changes |

### Shared Components

| Component | File | Responsibility |
|-----------|------|---------------|
| `MetricCard` | `src/features/dashboard/components/MetricCard.tsx` | KPI card with trend indicator + sparkline |
| `DailyActiveUsersChart` | `src/components/charts/DailyActiveUsersChart.tsx` | 14-day DAU area chart |
| `TopDropOffPages` | `src/components/charts/TopDropOffPages.tsx` | Ranked bounce-rate page list |
| `DateRangeFilter` | `src/components/filters/DateRangeFilter.tsx` | Date picker (UI only, not wired) |
| `CardSkeleton` | `src/components/feedback/CardSkeleton.tsx` | Loading skeleton |
| `CardErrorState` | `src/components/feedback/CardErrorState.tsx` | Retry-able error card |
| `CardEmptyState` | `src/components/feedback/CardEmptyState.tsx` | No-data empty state |
| `ThemeToggle` | `src/components/theme/ThemeToggle.tsx` | Dark/light mode switch |

### Feature Screens

Each feature screen in `src/features/*/` owns its layout composition and imports data from a co-located `data/` folder. Screen components are pure display — they read static data and render UI. No business logic or side effects currently exist.

---

## 5. Data Flow

### Current (Prototype)

```
data/*.ts (static constants)
        │
        ▼
Feature Screen (imports data, renders UI)
        │
        ▼
Shared Components (receive props, display)
```

### Target (Production)

```
JS SDK ──▶ Ingestion API ──▶ PostgreSQL
                                 │
                          Aggregation jobs
                                 │
                                 ▼
Edge Functions (API endpoints)
        │
        ▼
React Query hooks (replace static imports)
        │
        ▼
Feature Screen (loading/error/data states)
        │
        ▼
Shared Components (receive props, display)
```

**Migration path:** Replace each `import { data } from './data/file'` with a `useQuery()` hook that fetches from an edge function. The loading/error/empty states are already built into the UI.

---

## 6. Database Schema

### Core Tables

```sql
-- Organisations / teams
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Users (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID REFERENCES organizations(id),
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Role-based access (never on profiles table)
CREATE TYPE app_role AS ENUM ('admin', 'editor', 'viewer');
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Raw analytics events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) NOT NULL,
  session_id UUID NOT NULL,
  event_type TEXT NOT NULL,           -- 'page_view', 'click', 'form_submit', etc.
  page_url TEXT,
  metadata JSONB DEFAULT '{}',
  device_type TEXT,                   -- 'mobile', 'desktop', 'tablet'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Sessions (aggregated from events)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) NOT NULL,
  visitor_id TEXT NOT NULL,
  device_type TEXT,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  page_count INT DEFAULT 0,
  bounced BOOLEAN DEFAULT false
);

-- Funnel definitions
CREATE TABLE funnels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) NOT NULL,
  name TEXT NOT NULL,
  steps JSONB NOT NULL,               -- [{"name": "Landing", "url_pattern": "/"}]
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Pre-computed funnel results (updated by background job)
CREATE TABLE funnel_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_id UUID REFERENCES funnels(id) ON DELETE CASCADE,
  step_index INT NOT NULL,
  step_name TEXT NOT NULL,
  visitors INT NOT NULL,
  drop_off INT NOT NULL,
  computed_at TIMESTAMPTZ DEFAULT now()
);

-- AI-generated insights
CREATE TABLE insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) NOT NULL,
  severity TEXT CHECK (severity IN ('critical', 'warning', 'info')),
  title TEXT NOT NULL,
  description TEXT,
  root_causes JSONB,                  -- [{cause, severity, detail}]
  recommendations JSONB,              -- [{action, impact, priority}]
  status TEXT DEFAULT 'active',       -- 'active', 'dismissed', 'resolved'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Saved reports
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) NOT NULL,
  title TEXT NOT NULL,
  type TEXT,                          -- 'weekly', 'funnel', 'segment'
  config JSONB,
  schedule_cron TEXT,                 -- NULL = one-time
  last_generated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User preferences
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'light',
  email_notifications BOOLEAN DEFAULT true,
  weekly_digest BOOLEAN DEFAULT true
);

-- Daily aggregated metrics (for fast dashboard loads)
CREATE TABLE daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) NOT NULL,
  date DATE NOT NULL,
  total_sessions INT,
  total_page_views INT,
  bounce_rate NUMERIC(5,2),
  avg_session_duration_seconds INT,
  conversion_rate NUMERIC(5,2),
  dau INT,
  UNIQUE (org_id, date)
);
```

### RLS Policy Pattern

```sql
-- Use security definer function to avoid recursive RLS
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER
SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Example: org members can read their own org's data
CREATE POLICY "Users read own org data"
ON events FOR SELECT TO authenticated
USING (org_id IN (
  SELECT org_id FROM profiles WHERE id = auth.uid()
));
```

---

## 7. API Endpoints

All endpoints are Edge Functions (serverless). Auth via JWT in `Authorization` header.

| Method | Endpoint | Request | Response | Maps to Screen |
|--------|----------|---------|----------|---------------|
| `GET` | `/api/dashboard/metrics` | `?org_id&from&to` | `DashboardMetric[]` | Dashboard KPIs |
| `GET` | `/api/dashboard/insights` | `?org_id` | `{primary, secondary[]}` | Dashboard insights |
| `GET` | `/api/dashboard/dau` | `?org_id&from&to` | `{date, users}[]` | DAU chart |
| `GET` | `/api/pages/performance` | `?org_id&from&to&sort` | `PageMetric[]` | Pages screen |
| `GET` | `/api/pages/top-dropoff` | `?org_id&limit` | `{page, bounceRate}[]` | Dashboard drop-off list |
| `GET` | `/api/funnels` | `?org_id` | `Funnel[]` | Funnels list |
| `GET` | `/api/funnels/:id` | — | `{steps[], segments[], recommendations[]}` | Funnel detail |
| `GET` | `/api/dropoff/funnel` | `?org_id&funnel_id` | `{steps[], insights[]}` | Drop-off analysis |
| `GET` | `/api/segments` | `?org_id` | `{cohorts[], demographics[]}` | Segments screen |
| `GET` | `/api/insights/:id` | — | `{causes[], weekly_comparison[], recommendations[]}` | Insight detail |
| `POST` | `/api/insights/:id/action` | `{action_id}` | `{impact, steps[], status}` | Action result |
| `GET` | `/api/reports` | `?org_id` | `{recent[], scheduled[]}` | Reports screen |
| `POST` | `/api/reports` | `{title, type, config, schedule?}` | `Report` | Create report |
| `GET` | `/api/settings` | — | `UserPreferences` | Settings |
| `PATCH` | `/api/settings` | `{theme?, notifications?}` | `UserPreferences` | Settings |
| `POST` | `/api/events/ingest` | `Event[]` (batch) | `{received: number}` | SDK ingestion |

---

## 8. Authentication Plan

| Aspect | Decision |
|--------|---------|
| **Provider** | Lovable Cloud (Supabase Auth under the hood) |
| **Methods** | Email/password + Google OAuth + Apple Sign-In |
| **Session** | JWT stored in httpOnly cookie, refreshed automatically |
| **Roles** | `admin`, `editor`, `viewer` in `user_roles` table (never on profile) |
| **Team support** | Users belong to an `organization`; all data is org-scoped |
| **Protected routes** | All routes except `/login` and `/signup` require authenticated session |
| **Row-Level Security** | All tables enforce org-scoped access via RLS policies using `auth.uid()` |

### Auth Flow

```
Landing/Login ──▶ Supabase Auth ──▶ JWT issued
      │                                  │
      │                           Profile + role lookup
      │                                  │
      ▼                                  ▼
  Redirect to Dashboard          org_id injected into all API calls
```

---

## 9. Technical Risks

| Risk | Severity | Mitigation |
|------|----------|-----------|
| **Event volume at scale** | High | Batch ingestion endpoint; partition `events` table by month; use `daily_metrics` for dashboard queries instead of raw events |
| **Insight generation latency** | High | Pre-compute insights via background job (cron); cache results in `insights` table; only re-generate on new data |
| **LLM cost for insight copy** | Medium | Cache generated copy; use templates for common patterns; fall back to rule-based copy if LLM unavailable |
| **Funnel computation cost** | Medium | Pre-compute `funnel_results` nightly; only recompute on-demand for custom date ranges |
| **Stale data perception** | Medium | Show "last updated" timestamps on all cards; add real-time polling for critical metrics |
| **Multi-org data isolation** | High | Enforce org-scoped RLS on every table; integration tests to verify cross-org queries return empty |
| **Action execution safety** | High | Require admin role for destructive actions; add confirmation step; log all actions to audit table |
| **Mobile responsiveness** | Low | Prototype has basic responsive support; needs dedicated mobile testing pass at 375px–768px |

---

## 10. Recommended Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         Client (SPA)                             │
│  React 18 · React Router · React Query · Recharts · Tailwind    │
│                                                                  │
│  useQuery('/api/dashboard/metrics') ──▶ MetricCard               │
│  useQuery('/api/funnels/:id')       ──▶ FunnelDetailAnalysis     │
│  useMutation('/api/insights/:id/action') ──▶ ActionResult        │
└─────────────────────────┬────────────────────────────────────────┘
                          │ HTTPS + JWT
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│                    Lovable Cloud (Edge Functions)                 │
│                                                                  │
│  /api/dashboard/*    ──▶ SELECT from daily_metrics, insights     │
│  /api/funnels/*      ──▶ SELECT from funnels, funnel_results     │
│  /api/events/ingest  ──▶ INSERT into events (batch)              │
│  /api/insights/*/action ──▶ UPDATE insights, INSERT audit_log    │
└─────────────────────────┬────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│                    PostgreSQL (Lovable Cloud)                     │
│                                                                  │
│  events (partitioned) · sessions · daily_metrics                 │
│  funnels · funnel_results · insights · reports                   │
│  profiles · user_roles · organizations · user_preferences        │
│                                                                  │
│  RLS on all tables (org-scoped via auth.uid())                   │
└──────────────────────────────────────────────────────────────────┘
                          │
            ┌─────────────┼─────────────┐
            ▼             ▼             ▼
┌────────────────┐ ┌────────────┐ ┌──────────────┐
│  Cron Jobs     │ │  Insight   │ │  Report      │
│                │ │  Engine    │ │  Generator   │
│ • Aggregate    │ │            │ │              │
│   daily_metrics│ │ • Anomaly  │ │ • PDF render │
│ • Compute      │ │   detect   │ │ • Email send │
│   funnel_results││ • LLM copy │ │ • Schedule   │
└────────────────┘ └────────────┘ └──────────────┘
```

### Key Architectural Decisions

1. **Pre-computed aggregates** — Dashboard reads from `daily_metrics` and `funnel_results`, never from raw `events`. This keeps page loads under 500ms.
2. **Feature-based frontend modules** — Each `src/features/*` folder owns its screens, data hooks, and types. Shared UI stays in `src/components/`.
3. **React Query as the data layer** — Replace static imports with `useQuery` hooks. Loading/error/empty states are already built.
4. **Edge Functions for API** — Serverless, auto-scaling, co-located with the database.
5. **Roles in separate table** — `user_roles` table with `has_role()` security definer function to prevent privilege escalation.

---

## 11. Future Improvements

### Short-term (Post-MVP)

- [ ] **Wire DateRangeFilter** — Connect to query params and pass `from`/`to` to all API calls
- [ ] **Real-time metric updates** — WebSocket subscription on `daily_metrics` changes
- [ ] **Funnel builder UI** — Let users define custom funnels (add/remove/reorder steps)
- [ ] **Export to CSV/PDF** — Download table data and chart snapshots
- [ ] **Onboarding flow** — First-run setup wizard for SDK installation and first funnel

### Medium-term

- [ ] **Collaborative annotations** — Team members can comment on insights
- [ ] **Custom dashboards** — Drag-and-drop widget layout per user
- [ ] **A/B test integration** — Show experiment results alongside funnel data
- [ ] **Alerting rules** — User-defined thresholds that trigger email/Slack notifications
- [ ] **Cohort comparison** — Side-by-side segment analysis over time

### Long-term

- [ ] **Predictive analytics** — Forecast conversion rates based on historical trends
- [ ] **Natural language queries** — "Why did mobile bounce rate increase last Tuesday?"
- [ ] **Multi-product support** — Single org managing multiple products/apps
- [ ] **Data warehouse connectors** — Import from BigQuery, Snowflake, Mixpanel
- [ ] **White-label / embed mode** — Customers embed Bounce dashboards in their own product

---

## Appendix A: File → API Migration Map

| Current Static File | Replace With | API Endpoint |
|---------------------|-------------|-------------|
| `features/dashboard/data/dashboardData.ts` | `useQuery('dashboard-metrics')` | `GET /api/dashboard/metrics` |
| `features/dashboard/data/dashboardData.ts` (insights) | `useQuery('dashboard-insights')` | `GET /api/dashboard/insights` |
| `components/charts/DailyActiveUsersChart.tsx` (inline data) | `useQuery('dau')` | `GET /api/dashboard/dau` |
| `components/charts/TopDropOffPages.tsx` (inline data) | `useQuery('top-dropoff')` | `GET /api/pages/top-dropoff` |
| `features/drop-off/data/dropOffData.ts` | `useQuery('dropoff-funnel')` | `GET /api/dropoff/funnel` |
| `features/segments/data/segmentsData.ts` | `useQuery('segments')` | `GET /api/segments` |
| `features/funnels/data/funnelsData.ts` | `useQuery('funnels')` | `GET /api/funnels` |
| `features/funnels/data/funnelDetailData.ts` | `useQuery('funnel-detail')` | `GET /api/funnels/:id` |
| `features/pages-analytics/data/pagesData.ts` | `useQuery('pages')` | `GET /api/pages/performance` |
| `features/reports/data/reportsData.ts` | `useQuery('reports')` | `GET /api/reports` |
| `features/insights/data/insightData.ts` | `useQuery('insight-detail')` | `GET /api/insights/:id` |
| `features/insights/data/actionData.ts` | `useMutation('apply-action')` | `POST /api/insights/:id/action` |

---

## Appendix B: Environment Variables Needed

| Variable | Purpose | Where |
|----------|---------|-------|
| `SUPABASE_URL` | Lovable Cloud project URL | Auto-set by Lovable Cloud |
| `SUPABASE_ANON_KEY` | Public API key for client | Auto-set by Lovable Cloud |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side key for edge functions | Auto-set, never exposed to client |
| `LLM_API_KEY` | Insight copy generation | Edge function secret |
| `EMAIL_API_KEY` | Report email delivery (SendGrid/Resend) | Edge function secret |
| `GOOGLE_OAUTH_CLIENT_ID` | Google Sign-In | Auth provider config |
| `APPLE_OAUTH_CLIENT_ID` | Apple Sign-In | Auth provider config |

---

*This document should be read alongside [`livingprd.md`](./livingprd.md) for full product context.*
