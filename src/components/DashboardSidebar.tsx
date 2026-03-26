import { BarChart3, LayoutDashboard, FileText, Settings, Users, TrendingDown, Globe, Target, Plus } from "lucide-react";
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

const mainNav = [
  { icon: LayoutDashboard, label: "Home", url: "/" },
  { icon: TrendingDown, label: "Drop-off Analysis", url: "/drop-off" },
  { icon: Users, label: "User Segments", url: "/segments" },
];

const analyticsNav = [
  { icon: Globe, label: "Pages", url: "/pages" },
  { icon: Target, label: "Funnels", url: "/funnels" },
  { icon: FileText, label: "Reports", url: "/reports" },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-5">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="h-8 w-8 shrink-0 rounded-lg bg-primary flex items-center justify-center">
            <BarChart3 className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-bold text-[16px] text-foreground tracking-tight truncate">
              Bounce
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-1">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground/70 px-3 mb-1">
            Insights
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    tooltip={item.label}
                  >
                    <NavLink
                      to={item.url}
                      end
                      className="text-sidebar-foreground rounded-lg h-8"
                      activeClassName="!bg-sidebar-accent !text-sidebar-accent-foreground !font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="text-[13px]">{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground/70 px-3 mb-1">
            Analytics
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analyticsNav.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    tooltip={item.label}
                  >
                    <NavLink
                      to={item.url}
                      end
                      className="text-sidebar-foreground rounded-lg h-8"
                      activeClassName="!bg-sidebar-accent !text-sidebar-accent-foreground !font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="text-[13px]">{item.label}</span>
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
                className="text-sidebar-foreground rounded-lg h-8"
                activeClassName="!bg-sidebar-accent !text-sidebar-accent-foreground !font-medium"
              >
                <Settings className="h-4 w-4" />
                <span className="text-[13px]">Settings</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
