/**
 * App — Root component. Sets up routing, theming, and global providers.
 *
 * Route map:
 *  /                              → DashboardOverview (home)
 *  /drop-off                      → DropOffAnalysis
 *  /segments                      → UserSegments
 *  /pages                         → PagePerformance
 *  /funnels                       → FunnelsList
 *  /funnels/detail                → FunnelDetailAnalysis
 *  /reports                       → ReportsOverview
 *  /settings                      → SettingsPanel
 *  /insight/performance-drop      → PerformanceInsight
 *  /insight/performance-drop/action → InsightActionResult
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageTransitionLoader } from "@/components/layout/PageTransitionLoader";

/* Feature screens */
import DashboardOverview from "@/features/dashboard/DashboardOverview";
import DropOffAnalysis from "@/features/drop-off/DropOffAnalysis";
import UserSegments from "@/features/segments/UserSegments";
import PagePerformance from "@/features/pages-analytics/PagePerformance";
import FunnelsList from "@/features/funnels/FunnelsList";
import FunnelDetailAnalysis from "@/features/funnels/FunnelDetailAnalysis";
import ReportsOverview from "@/features/reports/ReportsOverview";
import SettingsPanel from "@/features/settings/SettingsPanel";
import PerformanceInsight from "@/features/insights/PerformanceInsight";
import InsightActionResult from "@/features/insights/InsightActionResult";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <PageTransitionLoader />
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/drop-off" element={<DropOffAnalysis />} />
            <Route path="/segments" element={<UserSegments />} />
            <Route path="/pages" element={<PagePerformance />} />
            <Route path="/funnels" element={<FunnelsList />} />
            <Route path="/funnels/detail" element={<FunnelDetailAnalysis />} />
            <Route path="/reports" element={<ReportsOverview />} />
            <Route path="/settings" element={<SettingsPanel />} />
            <Route path="/insight/performance-drop" element={<PerformanceInsight />} />
            <Route path="/insight/performance-drop/action" element={<InsightActionResult />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
