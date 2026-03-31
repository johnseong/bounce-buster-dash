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

## Section 6: Edge Case Checklist

- [ ] **Database connection failure** — Show `CardErrorState` with a retry button on every data-fetching card; never render a blank screen.
- [ ] **Empty data / new user** — Show `CardEmptyState` with a contextual CTA (e.g. "Create your first funnel") instead of empty tables or charts.
- [ ] **Form submission failure** — Display an inline error toast via Sonner; preserve all user-entered values in the form fields.
- [ ] **Loading states** — Render skeleton screens (`CardSkeleton` variants) on every screen that fetches data, matching the loaded layout grid exactly.
- [ ] **Session expiry** — Redirect to `/auth?expired=true` and show an info toast; distinguish from manual sign-out (no toast).
- [ ] **Zero analytics events** — Dashboard KPI cards show "0" with a "No data yet" subtitle instead of `NaN` or broken charts.
- [ ] **Funnel with no events** — Funnel detail page shows a zero-state bar chart with step labels but 0-height bars and a helper message.
- [ ] **Invalid funnel/insight ID in URL** — Show a "Not found" message with a link back to the list page; don't crash the app.
- [ ] **Concurrent tab sign-out** — If the user signs out in one tab, the other tab detects the `SIGNED_OUT` event and redirects to `/auth`.
- [ ] **Large date range query** — Queries spanning 90+ days should paginate or aggregate server-side to avoid exceeding the 1000-row Supabase default limit.
- [ ] **Duplicate segment/funnel names** — Show a validation error "A segment with this name already exists" before INSERT.
- [ ] **Scheduled report with deleted parent** — If a `saved_report` is deleted, its `scheduled_report` should cascade-delete; UI should not show orphaned schedules.
- [ ] **Profile update race condition** — Disable the "Save Changes" button during submission to prevent double-submit.
- [ ] **Google OAuth popup blocked** — Show a fallback message: "Pop-up blocked. Please allow pop-ups for this site and try again."
- [ ] **Network timeout on chart data** — React Query `retry: 2` with exponential backoff; after final failure, show `CardErrorState`.

---

## Section 7: Stress Test Plan

### Test 1: "Offline Mid-Dashboard" — Connection Failure

**Setup:** Log in and navigate to the Dashboard Overview so all data is loaded.

**Steps:**
1. Open browser DevTools → Network tab → set throttling to "Offline."
2. Click the date range filter and select a new range (triggers a refetch).
3. Observe all KPI cards, the DAU chart, and the drop-off table.

**Expected behavior:**
- Each card/chart transitions from its current state to `CardErrorState` with the message "Failed to load" and a visible "Retry" button.
- No card renders blank or shows a JS error overlay.
- Click "Retry" while still offline → error state persists (no crash).
- Restore connectivity → click "Retry" → data reloads successfully.

---

### Test 2: "Fresh Signup, Zero Data" — Empty User Experience

**Setup:** Use a brand-new email address that has never been used.

**Steps:**
1. Navigate to `/auth` and sign up with the new email + password.
2. Verify email (or auto-confirm if enabled) and land on the dashboard.
3. Visit every screen in order: Dashboard → Drop-off → Funnels → Funnel Detail (if any) → Pages → Segments → Reports → Insights → Settings.

**Expected behavior:**
- Dashboard: KPI cards show "0" values with a helpful subtitle ("No data yet — start tracking to see metrics"). DAU chart shows an empty-state message. Drop-off table shows `CardEmptyState`.
- Funnels List: "You haven't created any funnels yet." with a "Create your first funnel" button.
- Reports: "No reports generated yet." with a "Generate your first report" button.
- Segments: "No user segments defined." with a "Create a segment" button.
- Settings: Profile form is pre-filled with the user's email; display name field is empty and editable.
- No screen shows a blank area, a broken chart, `NaN`, `undefined`, or a spinner that never resolves.

---

### Test 3: "Spam-Click Gauntlet" — Rapid Repeated Actions

**Setup:** Log in with a seeded account that has existing funnels, reports, and segments.

**Steps:**
1. Go to Settings → rapidly click "Save Changes" 10 times in under 2 seconds.
2. Go to Insight Action Result → rapidly click "Apply All Changes" 5 times.
3. Go to Reports → rapidly click "Generate New" 5 times.
4. Go to Funnels List → click "Create Funnel" and immediately click the browser back button, then forward button.

**Expected behavior:**
- Settings: Only one `profiles` UPDATE executes; the button is disabled with a spinner after the first click. No duplicate toasts.
- Insight actions: Only one batch UPDATE fires; subsequent clicks are ignored while the mutation is in-flight. Success toast appears once.
- Reports: Only one `saved_reports` INSERT executes; button shows a loading state. No duplicate reports appear in the list.
- Funnel creation: Navigation is smooth; no half-created records are left in the database. The form either completes or is cleanly abandoned.

---

## Section 8: Handoff Note

### What's Real vs. What's Mocked

| Feature | Status | Notes |
|---------|--------|-------|
| User authentication (email + Google) | ✅ Real | Lovable Cloud auth with session management |
| Profile creation on signup | ✅ Real | `profiles` table populated via `handle_new_user()` trigger |
| Dashboard preferences storage | ✅ Real | `dashboard_preferences` table with RLS |
| Saved funnels persistence | ✅ Real | `saved_funnels` table with RLS |
| Saved reports persistence | ✅ Real | `saved_reports` table with RLS |
| Dashboard KPI metrics | 🟡 Mocked | Hardcoded in `dashboardData.ts` — needs React Query hook |
| Daily active users chart | 🟡 Mocked | Inline array in `DailyActiveUsersChart.tsx` |
| Top drop-off pages | 🟡 Mocked | Inline array in `TopDropOffPages.tsx` |
| Drop-off analysis | 🟡 Mocked | Hardcoded in `dropOffData.ts` |
| Funnel detail metrics | 🟡 Mocked | Hardcoded in `funnelDetailData.ts` |
| Page performance table | 🟡 Mocked | Hardcoded in `pagesData.ts` |
| User segments & demographics | 🟡 Mocked | Hardcoded in `segmentsData.ts` |
| Reports list & schedules | 🟡 Mocked | Hardcoded in `reportsData.ts` |
| Insight detail & actions | 🟡 Mocked | Hardcoded in `insightData.ts` / `actionData.ts` |
| Analytics event ingestion | ❌ Not built | No edge function or client-side tracker exists |
| Admin roles & team management | ❌ Not built | `user_roles` table not yet created |

### Database Schema Summary

| Table | Purpose |
|-------|---------|
| `profiles` | User display name and avatar; auto-created on signup |
| `dashboard_preferences` | Per-user layout, date range, and pinned metrics |
| `saved_funnels` | User-defined conversion funnels with ordered steps |
| `saved_reports` | Saved report configurations (type + filters) |
| `analytics_events` | Raw event stream: pageviews, clicks, conversions |
| `funnel_events` | Per-session step completion records for each funnel |
| `page_analytics` | Pre-aggregated daily page-level metrics |
| `insights` | AI-generated performance insights per user |
| `insight_actions` | Recommended fixes tied to each insight |
| `user_segments` | Named audience cohorts with filter rules |
| `scheduled_reports` | Cron-style schedules linked to saved reports |

### Auth & RLS Model

- **Authentication:** Email/password + Google OAuth via Lovable Cloud
- **Default role:** Every user sees only their own data (`auth.uid() = user_id`)
- **RLS enabled:** All 11 tables have row-level security active
- **Analytics ingestion:** `analytics_events`, `funnel_events`, `page_analytics` allow INSERT via service role for server-side data collection
- **Cross-table checks:** `owns_funnel()` and `owns_insight()` security-definer functions prevent RLS recursion on `funnel_events` and `insight_actions`

### Edge Cases Handled

> _To be filled after edge-case hardening is complete._

### Known Gaps

> _To be filled after stress testing is complete._

### Live URL

> _To be filled after deployment._

---

## Summary

- **12 screens** are implemented, all using **100% hardcoded mock data**
- **11 database tables** exist (4 original + 7 new) — only `profiles` is written to via trigger; the UI never queries the new tables yet
- **~40+ hardcoded values** need to be replaced with real queries
- **Auth is live** but only one role exists — admin/viewer roles should be added when team features are built
- **RLS is correctly configured** on all tables with per-user isolation and service-role ingestion for analytics data
- **15 edge cases** identified; none yet handled in UI code
- **3 stress tests** defined for connection failure, empty-user experience, and rapid-action resilience
