
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface SalaryEntry {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  hours_worked: number;
  base_salary: number;
  tips: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface WeeklySummary {
  weekStart: string;
  weekEnd: string;
  totalHours: number;
  totalIncome: number;
  totalTips: number;
  entries: SalaryEntry[];
}

export const useSalaryEntries = () => {
  const [entries, setEntries] = useState<SalaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchEntries = async () => {
    if (!user) {
      setEntries([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('salary_entries')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching salary entries:', error);
      toast({
        title: "Error",
        description: "Failed to load salary entries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [user]);

  const addEntry = async (entryData: Omit<SalaryEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('salary_entries')
        .insert([{
          ...entryData,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      
      setEntries(prev => [data, ...prev]);
      toast({
        title: "Entry Added",
        description: "Your salary entry has been saved successfully!",
      });
      
      return { data, error: null };
    } catch (error) {
      console.error('Error adding salary entry:', error);
      toast({
        title: "Error",
        description: "Failed to add salary entry",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateEntry = async (id: string, updates: Partial<SalaryEntry>) => {
    try {
      const { data, error } = await supabase
        .from('salary_entries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setEntries(prev => prev.map(entry => entry.id === id ? data : entry));
      toast({
        title: "Entry Updated",
        description: "Your salary entry has been updated successfully!",
      });
      
      return { data, error: null };
    } catch (error) {
      console.error('Error updating salary entry:', error);
      toast({
        title: "Error",
        description: "Failed to update salary entry",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('salary_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setEntries(prev => prev.filter(entry => entry.id !== id));
      toast({
        title: "Entry Deleted",
        description: "Your salary entry has been deleted successfully!",
      });
      
      return { error: null };
    } catch (error) {
      console.error('Error deleting salary entry:', error);
      toast({
        title: "Error",
        description: "Failed to delete salary entry",
        variant: "destructive",
      });
      return { error };
    }
  };

  const getWeeklySummaries = (): WeeklySummary[] => {
    const weekMap = new Map();
    
    entries.forEach((entry) => {
      const startDate = new Date(entry.start_date);
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
      week.totalHours += entry.hours_worked;
      week.totalIncome += entry.base_salary + entry.tips;
      week.totalTips += entry.tips;
      week.entries.push(entry);
    });
    
    return Array.from(weekMap.values()).sort((a, b) => 
      new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime()
    );
  };

  return {
    entries,
    loading,
    addEntry,
    updateEntry,
    deleteEntry,
    getWeeklySummaries,
    refetch: fetchEntries,
  };
};
