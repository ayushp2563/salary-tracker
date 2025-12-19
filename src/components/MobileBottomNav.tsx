import { Home, PlusCircle, Calculator, Search, BarChart3, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

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
  const navRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  
  const activeIndex = navItems.findIndex(item => item.tab === activeTab);

  useEffect(() => {
    if (navRef.current && activeIndex >= 0) {
      const buttons = navRef.current.querySelectorAll('button');
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
    <nav className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
      <div 
        ref={navRef}
        className="relative bg-background/90 backdrop-blur-xl border border-border/50 rounded-full shadow-lg px-2 py-2"
      >
        {/* Animated indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-12 bg-primary rounded-full transition-all duration-300 ease-out"
          style={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
          }}
        />
        
        <div className="flex items-center justify-around relative z-10">
          {navItems.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => onTabChange(item.tab)}
                className={cn(
                  "flex flex-col items-center justify-center w-14 h-12 rounded-full transition-all duration-300",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 transition-transform duration-300",
                  isActive && "scale-110"
                )} />
                <span className={cn(
                  "text-[10px] font-medium mt-0.5 transition-all duration-300",
                  isActive ? "opacity-100" : "opacity-70"
                )}>
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
