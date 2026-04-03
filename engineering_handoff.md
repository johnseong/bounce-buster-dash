# Bounce — Engineering Handoff Document

> **Version:** 1.1  
> **Date:** April 3, 2026  
> **Audience:** Engineering team  
> **Companion doc:** [`livingprd.md`](./livingprd.md)

---

## 1. System Overview

Bounce is an analytics dashboard SPA that surfaces actionable insights from user engagement data. The project has evolved beyond a static front-end prototype into a seeded full-stack demo environment backed by Lovable Cloud / Supabase.

The current implementation uses database-backed seed data for key dashboard metrics and visualizations. Dashboard Overview KPI cards, Daily Active Users, and Top Drop-off Pages now read from live database queries instead of static TypeScript constants. Other screens are still partially or fully backed by mock data and remain to be migrated.

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
| 1 | Dashboard Overview (KPIs, insights, DAU chart) | `/` | Partially live: KPI cards, DAU, and Top Drop-off Pages use DB queries; insight cards still partially static |
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
