import { BarChart3, LayoutDashboard, FileText, Settings, Users, TrendingDown, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: TrendingDown, label: "Drop-off Analysis", active: false },
  { icon: Users, label: "User Segments", active: false },
  { icon: Globe, label: "Pages", active: false },
  { icon: BarChart3, label: "Funnels", active: false },
  { icon: FileText, label: "Reports", active: false },
];

export function DashboardSidebar() {
  return (
    <aside className="w-56 border-r border-border bg-card min-h-screen flex flex-col">
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
            <BarChart3 className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-foreground">Bounce Analytics</span>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              item.active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-border">
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
          <Settings className="h-4 w-4" />
          Settings
        </button>
      </div>
    </aside>
  );
}
