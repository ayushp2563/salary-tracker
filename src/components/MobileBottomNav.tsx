import { Home, PlusCircle, Calculator, Search, BarChart3, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Home", icon: Home, tab: "overview" },
  { title: "Add", icon: PlusCircle, tab: "add" },
  { title: "Hours", icon: Clock, tab: "daily-hours" },
  { title: "Calc", icon: Calculator, tab: "calculator" },
  { title: "Stats", icon: BarChart3, tab: "analytics" },
];

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileBottomNav = ({ activeTab, onTabChange }: MobileBottomNavProps) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <button
            key={item.tab}
            onClick={() => onTabChange(item.tab)}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors",
              activeTab === item.tab
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className={cn(
              "h-5 w-5 transition-transform",
              activeTab === item.tab && "scale-110"
            )} />
            <span className={cn(
              "text-xs font-medium",
              activeTab === item.tab && "font-semibold"
            )}>
              {item.title}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};
