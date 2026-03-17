import { BarChart3, LayoutDashboard, FileText, Settings, Users, TrendingDown, Globe, ChevronsLeft, ChevronsRight } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", url: "/" },
  { icon: TrendingDown, label: "Drop-off Analysis", url: "/drop-off" },
  { icon: Users, label: "User Segments", url: "/segments" },
  { icon: Globe, label: "Pages", url: "/pages" },
  { icon: BarChart3, label: "Funnels", url: "/funnels" },
  { icon: FileText, label: "Reports", url: "/reports" },
];

export function DashboardSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="h-8 w-8 shrink-0 rounded-xl bg-gradient-to-b from-primary to-primary/80 flex items-center justify-center shadow-apple-sm">
            <BarChart3 className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-[14px] text-sidebar-foreground truncate">
              Bounce Analytics
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground/60">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    tooltip={item.label}
                  >
                    <NavLink
                      to={item.url}
                      end
                      className="text-muted-foreground rounded-xl"
                      activeClassName="!text-foreground !font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <NavLink
                to="/settings"
                className="text-muted-foreground rounded-xl"
                activeClassName="!text-foreground !font-medium"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={toggleSidebar} tooltip={collapsed ? "Expand" : "Collapse"} className="rounded-xl">
              {collapsed ? (
                <ChevronsRight className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronsLeft className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-muted-foreground">Collapse</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
