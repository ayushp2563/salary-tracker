import React from 'react';
import { Button } from '@/components/ui/button';
import { useThemeColor } from '@/contexts/ThemeColorContext';
import { Check } from 'lucide-react';

const colors = [
  { name: 'blue', label: 'Blue', class: 'bg-blue-600' },
  { name: 'green', label: 'Green', class: 'bg-green-600' },
  { name: 'purple', label: 'Purple', class: 'bg-purple-600' },
  { name: 'orange', label: 'Orange', class: 'bg-orange-600' },
  { name: 'red', label: 'Red', class: 'bg-red-600' },
  { name: 'teal', label: 'Teal', class: 'bg-teal-600' },
  { name: 'indigo', label: 'Indigo', class: 'bg-indigo-600' },
  { name: 'emerald', label: 'Emerald', class: 'bg-emerald-600' },
] as const;

export function ColorPicker() {
  const { themeColor, setThemeColor } = useThemeColor();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Theme Color</h3>
      <div className="grid grid-cols-4 gap-3">
        {colors.map((color) => (
          <Button
            key={color.name}
            variant="outline"
            size="sm"
            onClick={() => setThemeColor(color.name)}
            className={`relative h-16 p-2 flex flex-col items-center justify-center space-y-1 ${
              themeColor === color.name ? 'ring-2 ring-primary' : ''
            }`}
          >
            <div className={`w-6 h-6 rounded-full ${color.class}`} />
            <span className="text-xs">{color.label}</span>
            {themeColor === color.name && (
              <Check className="absolute top-1 right-1 h-3 w-3 text-primary" />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}