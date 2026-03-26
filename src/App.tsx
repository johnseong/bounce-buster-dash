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
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

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
import AuthPage from "@/pages/AuthPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const P = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <PageTransitionLoader />
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/" element={<P><DashboardOverview /></P>} />
              <Route path="/drop-off" element={<P><DropOffAnalysis /></P>} />
              <Route path="/segments" element={<P><UserSegments /></P>} />
              <Route path="/pages" element={<P><PagePerformance /></P>} />
              <Route path="/funnels" element={<P><FunnelsList /></P>} />
              <Route path="/funnels/detail" element={<P><FunnelDetailAnalysis /></P>} />
              <Route path="/reports" element={<P><ReportsOverview /></P>} />
              <Route path="/settings" element={<P><SettingsPanel /></P>} />
              <Route path="/insight/performance-drop" element={<P><PerformanceInsight /></P>} />
              <Route path="/insight/performance-drop/action" element={<P><InsightActionResult /></P>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
