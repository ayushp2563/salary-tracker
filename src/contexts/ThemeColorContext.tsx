import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeColor = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'teal' | 'indigo' | 'emerald';

type ThemeColorContextType = {
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
  applyThemeColor: (color: ThemeColor) => void;
};

const ThemeColorContext = createContext<ThemeColorContextType | undefined>(undefined);

const themeColors = {
  blue: {
    primary: '221 83% 53%', // blue-600
    primaryForeground: '210 40% 98%',
    accent: '221 83% 53%',
    accentForeground: '210 40% 98%',
  },
  green: {
    primary: '142 76% 36%', // green-600
    primaryForeground: '210 40% 98%',
    accent: '142 76% 36%',
    accentForeground: '210 40% 98%',
  },
  purple: {
    primary: '262 83% 58%', // purple-600
    primaryForeground: '210 40% 98%',
    accent: '262 83% 58%',
    accentForeground: '210 40% 98%',
  },
  orange: {
    primary: '20 91% 48%', // orange-600
    primaryForeground: '210 40% 98%',
    accent: '20 91% 48%',
    accentForeground: '210 40% 98%',
  },
  red: {
    primary: '0 84% 60%', // red-600
    primaryForeground: '210 40% 98%',
    accent: '0 84% 60%',
    accentForeground: '210 40% 98%',
  },
  teal: {
    primary: '173 80% 40%', // teal-600
    primaryForeground: '210 40% 98%',
    accent: '173 80% 40%',
    accentForeground: '210 40% 98%',
  },
  indigo: {
    primary: '239 84% 67%', // indigo-600
    primaryForeground: '210 40% 98%',
    accent: '239 84% 67%',
    accentForeground: '210 40% 98%',
  },
  emerald: {
    primary: '160 84% 39%', // emerald-600
    primaryForeground: '210 40% 98%',
    accent: '160 84% 39%',
    accentForeground: '210 40% 98%',
  },
};

export function ThemeColorProvider({
  children,
  defaultColor = 'blue',
  storageKey = 'salary-tracker-theme-color',
}: {
  children: React.ReactNode;
  defaultColor?: ThemeColor;
  storageKey?: string;
}) {
  const [themeColor, setThemeColor] = useState<ThemeColor>(
    () => (localStorage.getItem(storageKey) as ThemeColor) || defaultColor
  );

  const applyThemeColor = (color: ThemeColor) => {
    const root = document.documentElement;
    const colors = themeColors[color];
    
    Object.entries(colors).forEach(([key, value]) => {
      const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      root.style.setProperty(`--${cssVar}`, value);
    });
  };

  useEffect(() => {
    applyThemeColor(themeColor);
  }, [themeColor]);

  const handleSetThemeColor = (color: ThemeColor) => {
    localStorage.setItem(storageKey, color);
    setThemeColor(color);
    applyThemeColor(color);
  };

  const value = {
    themeColor,
    setThemeColor: handleSetThemeColor,
    applyThemeColor,
  };

  return (
    <ThemeColorContext.Provider value={value}>
      {children}
    </ThemeColorContext.Provider>
  );
}

export const useThemeColor = () => {
  const context = useContext(ThemeColorContext);

  if (context === undefined)
    throw new Error('useThemeColor must be used within a ThemeColorProvider');

  return context;
};