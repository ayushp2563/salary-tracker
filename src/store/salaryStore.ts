
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SalaryEntry } from '@/types/salary';

interface SalaryStore {
  entries: SalaryEntry[];
  addEntry: (entry: Omit<SalaryEntry, 'id' | 'createdAt'>) => void;
  updateEntry: (id: string, entry: Partial<SalaryEntry>) => void;
  deleteEntry: (id: string) => void;
  getWeeklySummaries: () => Array<{
    weekStart: string;
    weekEnd: string;
    totalHours: number;
    totalIncome: number;
    totalTips: number;
    entries: SalaryEntry[];
  }>;
}

export const useSalaryStore = create<SalaryStore>()(
  persist(
    (set, get) => ({
      entries: [],
      
      addEntry: (entry) => {
        const newEntry: SalaryEntry = {
          ...entry,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ entries: [...state.entries, newEntry] }));
      },
      
      updateEntry: (id, updatedEntry) => {
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id ? { ...entry, ...updatedEntry } : entry
          ),
        }));
      },
      
      deleteEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        }));
      },
      
      getWeeklySummaries: () => {
        const entries = get().entries;
        const weekMap = new Map();
        
        entries.forEach((entry) => {
          const startDate = new Date(entry.startDate);
          const weekStart = new Date(startDate);
          weekStart.setDate(startDate.getDate() - startDate.getDay());
          const weekKey = weekStart.toISOString().split('T')[0];
          
          if (!weekMap.has(weekKey)) {
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            weekMap.set(weekKey, {
              weekStart: weekStart.toISOString().split('T')[0],
              weekEnd: weekEnd.toISOString().split('T')[0],
              totalHours: 0,
              totalIncome: 0,
              totalTips: 0,
              entries: [],
            });
          }
          
          const week = weekMap.get(weekKey);
          week.totalHours += entry.hoursWorked;
          week.totalIncome += entry.baseSalary + entry.tips;
          week.totalTips += entry.tips;
          week.entries.push(entry);
        });
        
        return Array.from(weekMap.values()).sort((a, b) => 
          new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime()
        );
      },
    }),
    {
      name: 'salary-tracker-storage',
    }
  )
);
