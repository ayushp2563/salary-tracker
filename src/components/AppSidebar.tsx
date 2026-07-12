import { Home, PlusCircle, Search, BarChart3, Settings, Wallet, Clock, Receipt } from "lucide-react";
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
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Overview", icon: Home, tab: "overview" },
  { title: "Add Income", icon: PlusCircle, tab: "add" },
  { title: "Expenses", icon: Receipt, tab: "expenses" },
  { title: "Hours", icon: Clock, tab: "daily-hours" },
  { title: "Search", icon: Search, tab: "search" },
  { title: "Insights", icon: BarChart3, tab: "analytics" },
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
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Wallet className="mr-2 h-4 w-4" />
            {open && "Salary Tracker"}
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
