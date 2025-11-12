import { Home, PlusCircle, Calculator, Search, BarChart3, Settings, DollarSign } from "lucide-react";
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
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Overview", icon: Home, tab: "overview" },
  { title: "Add Entry", icon: PlusCircle, tab: "add" },
  { title: "Hours Calculator", icon: Calculator, tab: "calculator" },
  { title: "Search", icon: Search, tab: "search" },
  { title: "Analytics", icon: BarChart3, tab: "analytics" },
];

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  const { open } = useSidebar();
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <DollarSign className="mr-2 h-4 w-4" />
            {open && "Salary Tracker"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.tab)}
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
