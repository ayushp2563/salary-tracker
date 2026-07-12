import { Home, PlusCircle, Receipt, BarChart3, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { title: "Home", icon: Home, tab: "overview" },
  { title: "Income", icon: PlusCircle, tab: "add" },
  { title: "Spend", icon: Receipt, tab: "expenses" },
  { title: "Hours", icon: Clock, tab: "daily-hours" },
  { title: "Stats", icon: BarChart3, tab: "analytics" },
];

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileBottomNav = ({ activeTab, onTabChange }: MobileBottomNavProps) => {
  const navRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const activeIndex = navItems.findIndex((item) => item.tab === activeTab);

  useEffect(() => {
    if (navRef.current && activeIndex >= 0) {
      const buttons = navRef.current.querySelectorAll("button");
      const activeButton = buttons[activeIndex];
      if (activeButton) {
        const navRect = navRef.current.getBoundingClientRect();
        const buttonRect = activeButton.getBoundingClientRect();
        setIndicatorStyle({
          left: buttonRect.left - navRect.left + (buttonRect.width - 56) / 2,
          width: 56,
        });
      }
    }
  }, [activeIndex]);

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 lg:hidden">
      <div
        ref={navRef}
        className="relative rounded-2xl border border-border/50 bg-background/90 px-2 py-2 shadow-lg backdrop-blur-xl"
      >
        <div
          className="absolute top-1/2 h-12 -translate-y-1/2 rounded-xl bg-primary transition-all duration-300 ease-out"
          style={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
          }}
        />

        <div className="relative z-10 flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => onTabChange(item.tab)}
                className={cn(
                  "flex h-12 w-14 flex-col items-center justify-center rounded-xl transition-all duration-300",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5 transition-transform duration-300", isActive && "scale-110")} />
                <span
                  className={cn(
                    "mt-0.5 text-[10px] font-medium transition-all duration-300",
                    isActive ? "opacity-100" : "opacity-70"
                  )}
                >
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
