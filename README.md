# Bounce — User Engagement Analytics Dashboard

An analytics dashboard prototype that helps product teams understand funnel conversion, drop-offs, and user behaviour, and provides recommended actions to improve engagement.

## Purpose

Product managers, growth teams, and analytics teams use Bounce to:
- Quickly assess whether product performance is good or bad
- Identify where users drop off in conversion funnels
- Understand root causes behind performance changes
- Take guided actions to fix issues (e.g., optimise mobile experience)

## Tech Stack

- **React 18** + **TypeScript** — UI framework
- **Vite** — Build tool and dev server
- **Tailwind CSS** — Utility-first styling with semantic design tokens
- **shadcn/ui** — Accessible component primitives (Radix UI based)
- **Recharts** — Charts and data visualisation
- **React Router** — Client-side routing
- **next-themes** — Light/dark mode support

## Folder Structure

```
src/
├── features/                    # Feature-based modules (screens + data)
│   ├── dashboard/               # Home overview screen
│   │   ├── components/          #   MetricCard (extracted KPI card)
│   │   ├── data/                #   dashboardData.ts (mock KPIs, insights)
│   │   └── DashboardOverview.tsx
│   ├── drop-off/                # Drop-off analysis screen
│   │   ├── data/                #   dropOffData.ts (funnel steps, insights)
│   │   └── DropOffAnalysis.tsx
│   ├── segments/                # User segment cohorts screen
│   │   ├── data/                #   segmentsData.ts (cohorts, demographics)
│   │   └── UserSegments.tsx
│   ├── funnels/                 # Funnel list + detail analysis
│   │   ├── data/                #   funnelsData.ts, funnelDetailData.ts
│   │   ├── FunnelsList.tsx
│   │   └── FunnelDetailAnalysis.tsx
│   ├── pages-analytics/         # Per-page performance metrics
│   │   ├── data/                #   pagesData.ts
│   │   └── PagePerformance.tsx
│   ├── reports/                 # Generated + scheduled reports
│   │   ├── data/                #   reportsData.ts
│   │   └── ReportsOverview.tsx
│   ├── insights/                # Insight detail + action result
│   │   ├── data/                #   insightData.ts, actionData.ts
│   │   ├── PerformanceInsight.tsx
│   │   └── InsightActionResult.tsx
│   └── settings/                # User settings panel
│       └── SettingsPanel.tsx
├── components/                  # Shared, reusable components
│   ├── layout/                  #   DashboardLayout, DashboardSidebar, NavLink, PageTransitionLoader
│   ├── charts/                  #   DailyActiveUsersChart, TopDropOffPages
│   ├── feedback/                #   CardSkeleton, CardErrorState, CardEmptyState
│   ├── filters/                 #   DateRangeFilter
│   ├── theme/                   #   ThemeToggle
│   └── ui/                      #   shadcn/ui primitives (button, card, table, etc.)
├── hooks/                       # Custom React hooks
├── lib/                         # Utilities (cn helper)
├── pages/                       # Catch-all pages (NotFound)
├── App.tsx                      # Root component with routing and providers
├── main.tsx                     # Entry point
└── index.css                    # Design tokens and global styles
```

## Key Screens

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | DashboardOverview | KPI cards, critical insight, secondary insights, DAU chart, top drop-off pages |
| `/drop-off` | DropOffAnalysis | Funnel visualisation, step-by-step breakdown table |
| `/segments` | UserSegments | Audience cohort cards, age demographics |
| `/pages` | PagePerformance | Per-page views, bounce rates, trends |
| `/funnels` | FunnelsList | All tracked funnels with mini bar previews |
| `/funnels/detail` | FunnelDetailAnalysis | Step conversion chart, drop-off panel, segment breakdown, AI recommendations |
| `/reports` | ReportsOverview | Generated reports table, scheduled automations |
| `/settings` | SettingsPanel | Profile, appearance, notifications |
| `/insight/performance-drop` | PerformanceInsight | Root-cause analysis, weekly comparison chart, recommended actions |
| `/insight/performance-drop/action` | InsightActionResult | Apply fix flow with projected impact and success confirmation |

## Data Flow

All data is currently **static mock data** stored in `data/` folders within each feature. In production, these would be replaced with API calls via React Query. The separation ensures UI components remain pure and testable.

```
data/*.ts (constants) → Feature Screen (state + effects) → Shared Components (display)
```

## Design System

- Semantic colour tokens defined in `index.css` (HSL format)
- Extended in `tailwind.config.ts` for Tailwind class usage
- Light and dark mode supported via CSS variables
- Card-based layout with `.asana-card` utility class
- Consistent typography scale: 11px labels → 28px hero numbers

## Running Locally

```bash
npm install
npm run dev
```
