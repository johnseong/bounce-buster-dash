import { ReactNode } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  title: string;
  children: ReactNode;
}

export function DashboardLayout({ title, children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-xl border-b border-border/60 h-14 px-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground" />
              <h1 className="text-[15px] font-semibold text-foreground">{title}</h1>
            </div>
            <ThemeToggle />
          </header>
          <div className="flex-1 p-6 space-y-5">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
