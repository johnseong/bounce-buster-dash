# Bounce — Product Requirements Document (Living PRD)

> **Version:** 1.0  
> **Date:** March 26, 2026  
> **Status:** Prototype (static mock data)  
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

| Section | What it shows |
|---------|--------------|
| KPI Metric Bar (4 cards) | Total Sessions, Bounce Rate, Avg. Session Duration, Conversion Rate — each with trend indicator |
| Primary Insight Card | The single most critical issue (e.g., "Performance dropped 15%"), with severity badge, root cause summary, and action CTAs |
| Secondary Insight Cards (×2) | Supporting insights: one warning (mobile speed), one opportunity (docs engagement) |
| Daily Active Users Chart | 14-day area chart showing DAU trend |
| Top Drop-off Pages | Ranked list of pages with highest bounce rates |

**Loading state:** Skeleton screens for all sections  
**Error state:** Retry-able error card for chart failures

### 4.2 Insight Detail (`/insight/performance-drop`)

**Purpose:** Explain *why* performance changed and present options to fix it.

| Section | What it shows |
|---------|--------------|
| Alert Header | Severity label, headline, and contextual description |
| Bounce Rate Comparison Chart | This week vs. last week bar chart, showing the increase day-by-day |
| Root Cause Analysis | Three contributor cards (mobile bounce surge, checkout funnel loss, desktop steady) with severity indicators |
| Recommended Actions | Numbered, prioritised list with projected impact and "Fix Now" / "View" CTAs |

### 4.3 Action Result (`/insight/performance-drop/action`)

**Purpose:** Let users apply a fix and see projected impact — building trust that insights lead to outcomes.

| Section | What it shows |
|---------|--------------|
| Action Header | Description of the recommended fix and what it will do |
| Expected Impact (3 cards) | Before → After projections (bounce rate, load time, conversions) |
| Action Steps | Numbered list of specific changes that will be applied |
| Apply Button | Triggers a 2-second simulated application with progress bar |
| Success State | Confirmation with applied changes list, projected metrics, and "What's Next" guidance |

### 4.4 Drop-off Analysis (`/drop-off`)

**Purpose:** Visualise where users abandon the e-commerce conversion funnel.

- Insight summary cards (biggest drop-off, checkout friction, mobile drop-off)
- Horizontal funnel bar chart with progressive visitor loss
- Step-by-step breakdown table (visitors, drop-off count, retention rate)

### 4.5 User Segments (`/segments`)

**Purpose:** Compare engagement metrics across audience cohorts.

- Segment cards (Power Users, Mobile Visitors, Desktop, International, Returning) with bounce rate and avg. session
- Age demographics horizontal bar chart

### 4.6 Funnels List (`/funnels`)

**Purpose:** Browse all tracked conversion funnels at a glance.

- Funnel cards with mini bar chart previews, conversion rate, and trend indicator
- Click-through to Funnel Detail

### 4.7 Funnel Detail Analysis (`/funnels/detail`)

**Purpose:** Deep-dive into a single funnel with segment and step-level breakdowns.

- KPI row (overall conversion, total users, avg. time to convert, biggest drop-off step)
- Funnel step conversion bar chart (with worst step highlighted in red)
- Drop-off by step panel with colour-coded severity bars
- Segment breakdown table (traffic source × funnel step)
- AI-generated recommended actions with severity badges and projected impact

### 4.8 Page Performance (`/pages`)

**Purpose:** Identify which pages perform well and which need attention.

- Summary KPIs (total pages, total views, avg. bounce rate)
- Full page table with colour-coded bounce rates and trend arrows

### 4.9 Reports (`/reports`)

**Purpose:** Access generated reports and manage scheduled automations.

- Summary cards (total reports, scheduled count, last generated time)
- Recent reports table with type badges and download actions
- Scheduled reports list with next-run dates

### 4.10 Settings (`/settings`)

**Purpose:** Manage profile, appearance (dark mode), notification preferences, and account.

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

## 8. Mock Data vs. Real Backend Requirements

### Currently Mocked (Static Constants)

| Data | Location | What It Represents |
|------|----------|--------------------|
| KPI metrics (sessions, bounce, conversion) | `features/dashboard/data/dashboardData.ts` | Aggregated analytics for current period |
| Primary & secondary insights | `features/dashboard/data/dashboardData.ts` | AI-generated insight summaries |
| DAU time series (14 days) | `components/charts/DailyActiveUsersChart.tsx` | Daily active user counts |
| Top drop-off pages | `components/charts/TopDropOffPages.tsx` | Pages ranked by bounce rate |
| Drop-off funnel steps | `features/drop-off/data/dropOffData.ts` | E-commerce funnel visitor counts |
| User segments & demographics | `features/segments/data/segmentsData.ts` | Cohort-level engagement metrics |
| Funnel definitions & steps | `features/funnels/data/funnelsData.ts` | Multiple funnel configurations |
| Funnel detail (steps, segments, recommendations) | `features/funnels/data/funnelDetailData.ts` | Per-funnel deep-dive data |
| Page performance metrics | `features/pages-analytics/data/pagesData.ts` | Per-page views, bounce, trends |
| Reports list & schedules | `features/reports/data/reportsData.ts` | Report metadata |
| Insight detail (weekly comparison, causes, recommendations) | `features/insights/data/insightData.ts` | Root-cause analysis data |
| Action steps & projected impact | `features/insights/data/actionData.ts` | Fix descriptions and projections |
| User profile (name, email) | `features/settings/SettingsPanel.tsx` | Inline defaults |

### Required for Production

| Capability | Purpose | Suggested Approach |
|------------|---------|-------------------|
| **Analytics data ingestion** | Ingest page views, sessions, events from customer's product | SDK (JS snippet) + event pipeline (e.g., Segment, PostHog, or custom) |
| **Funnel computation engine** | Calculate conversion rates, drop-off by step, segment breakdowns | Backend service with time-windowed aggregation |
| **Insight generation** | Detect anomalies, rank by severity, generate natural-language summaries | Anomaly detection model + LLM for copy generation |
| **Action execution** | Apply recommended fixes (e.g., toggle feature flags, update page config) | Integration with customer's deployment pipeline or feature flag service |
| **User authentication** | Login, teams, roles | Auth provider (Lovable Cloud / Supabase Auth) |
| **Persistent storage** | User preferences, saved reports, notification settings | PostgreSQL via Lovable Cloud |
| **Report generation** | Scheduled PDF/email reports | Background job + email service |
| **Real-time alerts** | Spike detection, threshold-based notifications | WebSocket or push notification service |

---

## 9. Technical Architecture Overview

### Current State (Prototype)

```
┌──────────────────────────────────────────────────┐
│                   Client (SPA)                   │
│                                                  │
│  React 18 + TypeScript + Vite                    │
│  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  App.tsx      │  │  features/               │  │
│  │  (Router)     │  │    dashboard/            │  │
│  │               │  │    drop-off/             │  │
│  │  11 routes    │  │    segments/             │  │
│  │               │  │    funnels/              │  │
│  │               │  │    pages-analytics/      │  │
│  │               │  │    reports/              │  │
│  │               │  │    insights/             │  │
│  │               │  │    settings/             │  │
│  └──────────────┘  └──────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐│
│  │  components/                                 ││
│  │    layout/   (shell, sidebar, nav)           ││
│  │    charts/   (DAU chart, drop-off list)      ││
│  │    feedback/ (skeletons, error, empty)       ││
│  │    filters/  (date range)                    ││
│  │    theme/    (dark mode toggle)              ││
│  │    ui/       (shadcn primitives)             ││
│  └──────────────────────────────────────────────┘│
│                                                  │
│  Static mock data in features/*/data/*.ts        │
│  No API calls · No authentication · No database  │
└──────────────────────────────────────────────────┘
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
| Recharts | Charts and data visualisation |
| Tailwind CSS | Styling with semantic design tokens |
| shadcn/ui (Radix) | Accessible component primitives |
| React Query | Data fetching (ready but unused in prototype) |
| next-themes | Light/dark mode |
| date-fns | Date manipulation (date range filter) |

---

## 10. Recommended Next Steps

### Phase 1 — Validate Prototype (Weeks 1–2)

- [ ] **Usability testing** — Run 5–8 moderated sessions with target users on the current prototype
- [ ] **Measure baseline** — Track insight CTR, time-to-first-click, and completion of the 3-screen flow
- [ ] **Iterate on copy** — Refine insight headlines and CTA labels based on user feedback
- [ ] **Mobile responsiveness** — Test and fix layouts on 375px–768px viewports

### Phase 2 — Backend Foundation (Weeks 3–6)

- [ ] **Enable Lovable Cloud** — Set up authentication, database, and edge functions
- [ ] **User auth** — Implement sign-up/login flow with team support
- [ ] **Analytics data model** — Design schema for events, sessions, pages, funnels
- [ ] **API endpoints** — Replace static data files with React Query hooks fetching from edge functions
- [ ] **Date range filtering** — Wire the existing DateRangeFilter component to query parameters

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
