# Integration Plan

> Auto-generated from codebase analysis — 2026-03-31

---

## Section 1: M4 Status Check

| Item | Status | Details |
|------|--------|---------|
| **Total Screens** | ✅ 12 screens | Dashboard Overview, Drop-off Analysis, User Segments, Pages, Funnels List, Funnel Detail, Insight Detail, Action Result, Reports, Settings, Auth, 404 Not Found |
| **Living PRD** | ✅ Exists | `livingprd.md` — covers product overview, target users, problem statement, screens, user flow, hypothesis, success metrics, mocked vs real data, architecture, and next steps |
| **Clean naming** | ✅ Yes | Components use descriptive names (e.g. `DashboardOverview`, `FunnelDetailAnalysis`, `MetricCard`, `TopDropOffPages`). Data files are separated by feature. Functions and variables are clearly named. |
| **GitHub connected** | ✅ Yes | Project is synced to a GitHub repository |
| **Database backend** | ✅ Connected | Lovable Cloud is enabled with 4 tables: `profiles`, `dashboard_preferences`, `saved_funnels`, `saved_reports`. RLS policies are configured. Auth is live with email/password + Google OAuth. |

---

## Section 2: Data Audit — What's Still Hardcoded?

Every value below is defined in static mock data files or inline JSX — none come from database queries.

| Screen / Component | Hardcoded Value | What It Should Query |
|---|---|---|
| **DashboardOverview** (via `dashboardData.ts`) | `"79,842"` Total Sessions | `analytics_events` table — `COUNT(DISTINCT session_id)` for selected date range |
| **DashboardOverview** (via `dashboardData.ts`) | `"60%"` Bounce Rate | `analytics_events` — single-pageview sessions / total sessions × 100 |
| **DashboardOverview** (via `dashboardData.ts`) | `"1m 42s"` Avg. Session | `analytics_events` — `AVG(session_end - session_start)` |
| **DashboardOverview** (via `dashboardData.ts`) | `"4.27%"` Conversion Rate | `funnel_events` — users reaching final step / users entering first step |
| **DashboardOverview** (via `dashboardData.ts`) | `"+12.4%"`, `"-2.4%"`, `"+8s"`, `"+0.8%"` change values | Compare current vs prior period for each metric |
| **DashboardOverview** (via `dashboardData.ts`) | Primary insight: `"Performance dropped 15%…"` | `insights` table — AI-generated or rule-based alerts |
| **DashboardOverview** (via `dashboardData.ts`) | Secondary insights (mobile speed, docs engagement) | `insights` table — latest warning/success alerts |
| **DailyActiveUsersChart** | 14 inline `{ date, dau }` data points (Mar 1–14) | `analytics_events` — `COUNT(DISTINCT user_id) GROUP BY date` for last 14 days |
| **DailyActiveUsersChart** | `"2,050"` latest DAU shown in header | Same query, most recent day |
| **TopDropOffPages** | 5 inline `{ path, bounceRate, sessions }` objects | `page_analytics` — top 5 pages by bounce rate with session counts |
| **DropOffAnalysis** (via `dropOffData.ts`) | 5 funnel steps with visitor counts (12,480 → 1,120) | `funnel_events` — aggregate visitors per step for selected funnel |
| **DropOffAnalysis** (via `dropOffData.ts`) | 3 insight cards (biggest drop-off, checkout friction, mobile drop-off) | `insights` table — drop-off-specific alerts |
| **UserSegments** (via `segmentsData.ts`) | 5 segments (Power Users, Mobile, Desktop, International, Returning) with counts, bounce, avg session | `user_segments` table — segment definitions + aggregated metrics from `analytics_events` |
| **UserSegments** (via `segmentsData.ts`) | 5 age demographic bars (18–24: 22%, 25–34: 38%, etc.) | `user_demographics` or profile metadata — `COUNT GROUP BY age_bucket` |
| **PagePerformance** (via `pagesData.ts`) | 8 pages with views, bounceRate, avgTime, trend | `page_analytics` — per-page aggregates for selected date range |
| **FunnelsList** (via `funnelsData.ts`) | 3 funnels (Signup Flow 24.8%, Purchase Flow 8.9%, Feature Adoption 35.2%) | `saved_funnels` + `funnel_events` — user's funnels with computed conversion rates |
| **FunnelDetailAnalysis** (via `funnelDetailData.ts`) | 5 funnel steps with users/conversion/dropOff | `funnel_events` — step-level aggregates for the selected funnel |
| **FunnelDetailAnalysis** (via `funnelDetailData.ts`) | 4 segment rows (Organic Search, Paid Ads, Direct, Social) | `funnel_events` joined with `analytics_events.source` — segment × step matrix |
| **FunnelDetailAnalysis** (via `funnelDetailData.ts`) | 4 recommendations (critical/high/medium/low) | `insights` table — AI-generated per-funnel recommendations |
| **FunnelDetailAnalysis** (inline JSX) | KPI row: `"18.6%"`, `"10,000"`, `"4.2 min"`, `"Signup Form"` | Computed from `funnel_events` for selected funnel |
| **FunnelDetailAnalysis** (inline JSX) | Header: `"10,000 users entered · 1,860 completed · Last 30 days"` | Same aggregates |
| **PerformanceInsight** (via `insightData.ts`) | 7 daily comparison data points (Mon–Sun, thisWeek vs lastWeek) | `analytics_events` — daily bounce rate for current vs prior week |
| **PerformanceInsight** (via `insightData.ts`) | 3 root-cause contributors (mobile bounce 72%, checkout lost 740, desktop steady) | `insights` table — root cause breakdown for the alert |
| **PerformanceInsight** (via `insightData.ts`) | 3 recommendations with impact estimates | `insights` table — recommended actions |
| **PerformanceInsight** (inline JSX) | `"Your performance dropped by 15% this week"`, `"52% to 60%"` | `insights` table — alert detail |
| **InsightActionResult** (via `actionData.ts`) | 3 action steps (mobile layout, lazy-load, single CTA) | `insight_actions` table — action definitions for a recommendation |
| **InsightActionResult** (via `actionData.ts`) | 3 expected results (72%→55%, 4.2s→1.8s, 1,120→1,420) | `insight_actions` — projected impact |
| **InsightActionResult** (inline JSX) | `"Optimize mobile landing page"`, `"3 optimizations"` | `insight_actions` — action title/description |
| **ReportsOverview** (via `reportsData.ts`) | 6 report rows with names, dates, types | `saved_reports` table — user's reports (table exists but UI doesn't query it) |
| **ReportsOverview** (via `reportsData.ts`) | 2 scheduled reports with frequency and next run | `scheduled_reports` table (needs creation) |
| **ReportsOverview** (inline JSX) | `"2 hours ago"` last generated | `saved_reports` — `MAX(created_at)` |
| **SettingsPanel** (inline JSX) | `"Alex"` display name, `"alex@example.com"` email | `profiles` table — user's profile (table exists but UI doesn't query it) |
| **DashboardSidebar** (inline JSX) | `"Bounce"` product name | Config/environment variable or hardcoded constant (acceptable) |

---

## Section 3: Schema Design

### Existing Tables (from M4)

#### `profiles`
| Field | Type | Purpose |
|-------|------|---------|
| `id` | uuid (PK) | Row identifier |
| `user_id` | uuid (unique) | References auth user |
| `display_name` | text (nullable) | User's display name |
| `avatar_url` | text (nullable) | Profile image URL |
| `created_at` | timestamptz | Row creation time |
| `updated_at` | timestamptz | Last update time |

#### `dashboard_preferences`
| Field | Type | Purpose |
|-------|------|---------|
| `id` | uuid (PK) | Row identifier |
| `user_id` | uuid | References auth user |
| `layout` | jsonb | Dashboard widget layout config |
| `date_range` | text | Selected date range filter (default `'7d'`) |
| `pinned_metrics` | text[] | Metrics the user has pinned |
| `created_at` | timestamptz | Row creation time |
| `updated_at` | timestamptz | Last update time |

#### `saved_funnels`
| Field | Type | Purpose |
|-------|------|---------|
| `id` | uuid (PK) | Row identifier |
| `user_id` | uuid | Funnel owner |
| `name` | text | Funnel name (e.g. "Signup Flow") |
| `steps` | jsonb | Ordered array of step definitions |
| `created_at` | timestamptz | Row creation time |
| `updated_at` | timestamptz | Last update time |

#### `saved_reports`
| Field | Type | Purpose |
|-------|------|---------|
| `id` | uuid (PK) | Row identifier |
| `user_id` | uuid | Report owner |
| `title` | text | Report display name |
| `report_type` | text | "Automated" or "Custom" |
| `config` | jsonb | Report filter/config payload |
| `created_at` | timestamptz | Row creation time |
| `updated_at` | timestamptz | Last update time |

---

### Proposed New Tables

#### `analytics_events` *(NEW — core event ingestion)*
| Field | Type | Purpose |
|-------|------|---------|
| `id` | uuid (PK) | Event identifier |
| `user_id` | uuid (nullable) | Authenticated user (null for anonymous) |
| `session_id` | uuid | Groups events into sessions |
| `event_type` | text | `"pageview"`, `"click"`, `"form_submit"`, etc. |
| `page_path` | text | URL path (e.g. `"/pricing"`) |
| `page_title` | text | Page display title |
| `referrer` | text (nullable) | Traffic source URL |
| `source` | text (nullable) | Attribution source (`"organic"`, `"paid"`, `"direct"`, `"social"`) |
| `device_type` | text | `"mobile"`, `"desktop"`, `"tablet"` |
| `country` | text (nullable) | Geo-IP country code |
| `duration_ms` | int (nullable) | Time spent on page in milliseconds |
| `metadata` | jsonb | Arbitrary event properties |
| `created_at` | timestamptz | Event timestamp |

> **Replaces:** DailyActiveUsersChart data, TopDropOffPages data, dashboard KPIs, page performance metrics, segment metrics, weekly comparison chart data.

#### `funnel_events` *(NEW — funnel step tracking)*
| Field | Type | Purpose |
|-------|------|---------|
| `id` | uuid (PK) | Row identifier |
| `funnel_id` | uuid (FK → saved_funnels) | Which funnel this event belongs to |
| `user_id` | uuid (nullable) | The user progressing through the funnel |
| `session_id` | uuid | Session context |
| `step_name` | text | Step label (e.g. `"Signup Form"`) |
| `step_index` | int | Ordinal position in funnel (0-based) |
| `completed` | boolean | Whether user completed this step |
| `source` | text (nullable) | Traffic source for segment breakdown |
| `created_at` | timestamptz | When the user reached this step |

> **Replaces:** Drop-off funnel data, funnel detail step data, segment breakdown table, funnel list conversion rates.

#### `page_analytics` *(NEW — pre-aggregated page metrics)*
| Field | Type | Purpose |
|-------|------|---------|
| `id` | uuid (PK) | Row identifier |
| `page_path` | text | URL path |
| `page_title` | text | Display title |
| `date` | date | Aggregation date |
| `views` | int | Total pageviews |
| `unique_visitors` | int | Distinct users |
| `bounce_count` | int | Single-page sessions |
| `total_duration_ms` | bigint | Sum of time-on-page |
| `created_at` | timestamptz | Row creation time |

> **Replaces:** Pages screen data, TopDropOffPages component data.

#### `insights` *(NEW — AI-generated alerts and recommendations)*
| Field | Type | Purpose |
|-------|------|---------|
| `id` | uuid (PK) | Row identifier |
| `user_id` | uuid | Who this insight is for |
| `type` | text | `"alert"`, `"recommendation"`, `"root_cause"` |
| `severity` | text | `"critical"`, `"high"`, `"medium"`, `"low"`, `"success"` |
| `title` | text | Headline (e.g. "Performance dropped 15%") |
| `description` | text | Detailed explanation |
| `impact` | text (nullable) | Projected impact (e.g. "+12% conversion") |
| `related_funnel_id` | uuid (nullable, FK → saved_funnels) | Associated funnel |
| `related_page_path` | text (nullable) | Associated page |
| `metadata` | jsonb | Extra context (root causes, comparison data) |
| `is_read` | boolean | Whether user has seen it |
| `created_at` | timestamptz | When the insight was generated |

> **Replaces:** Primary/secondary dashboard insights, drop-off insights, funnel recommendations, performance insight detail, root-cause contributors.

#### `insight_actions` *(NEW — actionable fixes tied to insights)*
| Field | Type | Purpose |
|-------|------|---------|
| `id` | uuid (PK) | Row identifier |
| `insight_id` | uuid (FK → insights) | Parent insight |
| `title` | text | Action name |
| `description` | text | What will be changed |
| `projected_impact` | jsonb | Before/after metrics |
| `status` | text | `"pending"`, `"applied"`, `"reverted"` |
| `applied_at` | timestamptz (nullable) | When user applied the fix |
| `created_at` | timestamptz | Row creation time |

> **Replaces:** Action steps data, expected results data, apply/undo state.

#### `user_segments` *(NEW — segment definitions)*
| Field | Type | Purpose |
|-------|------|---------|
| `id` | uuid (PK) | Row identifier |
| `user_id` | uuid | Segment owner |
| `name` | text | Segment name (e.g. "Power Users") |
| `icon_key` | text | Icon identifier for UI |
| `filter_rules` | jsonb | Rules defining segment membership (e.g. `{"device": "mobile"}`) |
| `color_class` | text | Tailwind color class for display |
| `created_at` | timestamptz | Row creation time |
| `updated_at` | timestamptz | Last update time |

> **Replaces:** Segments mock data. Actual metrics (count, bounce, avgSession) are computed live from `analytics_events` using `filter_rules`.

#### `scheduled_reports` *(NEW — report automation)*
| Field | Type | Purpose |
|-------|------|---------|
| `id` | uuid (PK) | Row identifier |
| `user_id` | uuid | Schedule owner |
| `report_id` | uuid (FK → saved_reports) | Which report template to run |
| `frequency` | text | `"weekly"`, `"monthly"`, `"daily"` |
| `next_run_at` | timestamptz | Next scheduled execution |
| `last_run_at` | timestamptz (nullable) | Last execution time |
| `is_active` | boolean | Whether schedule is enabled |
| `created_at` | timestamptz | Row creation time |

> **Replaces:** Scheduled reports mock data in ReportsOverview.

---

## Section 4: Auth Model & Permissions

### Current Auth State

- **Provider:** Email/password + Google OAuth (configured via Lovable Cloud)
- **Session:** Supabase Auth with JWT, persisted in localStorage
- **Profile creation:** Automatic via `handle_new_user()` trigger on signup

### User Roles

| Role | Description | Exists Today? |
|------|-------------|---------------|
| **User** (default) | Standard product manager / analyst. Can view their own dashboards, funnels, reports, and insights. | ✅ Implicit — all authenticated users |
| **Admin** | Team administrator. Can view all team members' data, manage shared funnels/reports, configure workspace settings. | ❌ Not yet implemented |
| **Viewer** (future) | Read-only access to shared dashboards. Cannot create/edit funnels or reports. | ❌ Not yet implemented |

### Role Implementation Plan

When roles are needed, create a `user_roles` table following the established pattern:

```sql
CREATE TYPE public.app_role AS ENUM ('admin', 'user', 'viewer');

CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
```

### Permissions by Role

| Action | User | Admin | Viewer |
|--------|------|-------|--------|
| View own dashboard & metrics | ✅ | ✅ | ✅ |
| Create/edit own funnels | ✅ | ✅ | ❌ |
| Create/edit own reports | ✅ | ✅ | ❌ |
| Update own profile & preferences | ✅ | ✅ | ✅ |
| View all team members' data | ❌ | ✅ | ❌ |
| Manage workspace settings | ❌ | ✅ | ❌ |
| Delete other users' data | ❌ | ✅ | ❌ |
| Apply insight actions | ✅ | ✅ | ❌ |

### Row-Level Security (RLS) Policies

#### Existing Tables — Current Policies (all correct)

| Table | Policy | Rule |
|-------|--------|------|
| `profiles` | SELECT/INSERT/UPDATE own | `auth.uid() = user_id` |
| `dashboard_preferences` | SELECT/INSERT/UPDATE own | `auth.uid() = user_id` |
| `saved_funnels` | Full CRUD own | `auth.uid() = user_id` |
| `saved_reports` | Full CRUD own | `auth.uid() = user_id` |

#### New Tables — Required Policies

| Table | Policy | Rule |
|-------|--------|------|
| `analytics_events` | INSERT: service role only | Events ingested via backend edge function, not client |
| `analytics_events` | SELECT: own data | `auth.uid() = user_id` (or via service role for aggregation) |
| `funnel_events` | INSERT: service role only | Ingested server-side |
| `funnel_events` | SELECT: own funnel data | `funnel_id IN (SELECT id FROM saved_funnels WHERE user_id = auth.uid())` |
| `page_analytics` | SELECT: authenticated users | All authenticated users can view page-level aggregates (no PII) |
| `page_analytics` | INSERT/UPDATE: service role only | Populated by aggregation jobs |
| `insights` | SELECT/UPDATE own | `auth.uid() = user_id` (UPDATE for marking read) |
| `insights` | INSERT: service role only | Generated by backend AI/rules engine |
| `insight_actions` | SELECT: via parent insight | `insight_id IN (SELECT id FROM insights WHERE user_id = auth.uid())` |
| `insight_actions` | UPDATE own: status changes | Same ownership check for apply/revert |
| `user_segments` | Full CRUD own | `auth.uid() = user_id` |
| `scheduled_reports` | Full CRUD own | `auth.uid() = user_id` |

#### Admin Override Pattern

When admin roles are implemented, add permissive policies using:

```sql
CREATE POLICY "Admins can select all"
ON public.<table_name>
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
```

---

## Summary

- **12 screens** are implemented, all using **100% hardcoded mock data**
- **4 database tables** exist but only `profiles` is written to (via trigger) — the UI never queries any table
- **~40+ hardcoded values** need to be replaced with real queries
- **7 new tables** are proposed to fully replace all mock data
- **Auth is live** but only one role exists — admin/viewer roles should be added when team features are built
- **RLS is correctly configured** on existing tables; new tables need per-user isolation with service-role ingestion for analytics data
