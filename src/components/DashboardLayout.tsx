import { ReactNode } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Search } from "lucide-react";

interface DashboardLayoutProps {
  title: string;
  children: ReactNode;
  headerContent?: ReactNode;
}

export function DashboardLayout({ title, children, headerContent }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-10 bg-card border-b border-border h-14 px-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <div className="flex items-center gap-2 bg-accent rounded-lg px-3 py-1.5 w-56">
                <Search className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[13px] text-muted-foreground">Search</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {headerContent}
              <ThemeToggle />
              <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center">
                <span className="text-[12px] font-semibold text-primary">A</span>
              </div>
            </div>
          </header>
          <div className="flex-1 p-6 space-y-5 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
