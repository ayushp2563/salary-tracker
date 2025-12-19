import { Home, PlusCircle, Calculator, Search, BarChart3, Settings, DollarSign, Clock, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Overview", icon: Home, tab: "overview" },
  { title: "Add Entry", icon: PlusCircle, tab: "add" },
  { title: "Daily Hours", icon: Clock, tab: "daily-hours" },
  { title: "Hours Calculator", icon: Calculator, tab: "calculator" },
  { title: "Search", icon: Search, tab: "search" },
  { title: "Analytics", icon: BarChart3, tab: "analytics" },
];

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  const { open, setOpenMobile, isMobile } = useSidebar();
  const location = useLocation();

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b border-border/40 px-2 py-3">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          {open && (
            <div className="flex flex-col">
              <span className="font-semibold text-sm">Salary Tracker</span>
              <span className="text-[10px] text-muted-foreground">Tap to navigate</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-1.5">
            <Menu className="h-3 w-3" />
            {open && "Menu"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => handleTabChange(item.tab)}
                    isActive={activeTab === item.tab}
                    tooltip={item.title}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/settings"}
                  tooltip="Settings"
                  onClick={() => isMobile && setOpenMobile(false)}
                >
                  <Link to="/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
