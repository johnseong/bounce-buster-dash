/**
 * ProtectedRoute — Redirects unauthenticated users to /auth.
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { BarChart3 } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center animate-pulse">
          <BarChart3 className="h-4 w-4 text-primary-foreground" />
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return <>{children}</>;
}
