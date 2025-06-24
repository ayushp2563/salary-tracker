
import { useState, useEffect, useCallback } from 'react';
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
      console.log('Fetching salary entries for user:', user.id);
      const { data, error } = await supabase
        .from('salary_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false });

      if (error) {
        console.error('Error fetching salary entries:', error);
        throw error;
      }
      
      console.log('Fetched entries:', data?.length);
      setEntries(data || []);
    } catch (error: any) {
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

  // Set up real-time subscription
  useEffect(() => {
    if (!user) {
      return;
    }

    console.log('Setting up real-time subscription for user:', user.id);
    
    const channel = supabase
      .channel(`salary_entries_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'salary_entries',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          
          if (payload.eventType === 'INSERT') {
            setEntries((prev) => [payload.new as SalaryEntry, ...prev]);
            toast({
              title: "Entry Added",
              description: "Your salary entry has been saved!",
            });
          } else if (payload.eventType === 'UPDATE') {
            setEntries((prev) =>
              prev.map((entry) =>
                entry.id === payload.new.id ? (payload.new as SalaryEntry) : entry
              )
            );
            toast({
              title: "Entry Updated",
              description: "Your salary entry has been updated!",
            });
          } else if (payload.eventType === 'DELETE') {
            setEntries((prev) => prev.filter((entry) => entry.id !== payload.old.id));
            toast({
              title: "Entry Deleted",
              description: "Your salary entry has been deleted!",
            });
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const addEntry = async (entryData: Omit<SalaryEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      console.log('Adding new entry:', entryData);
      const { data, error } = await supabase
        .from('salary_entries')
        .insert([{
          ...entryData,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding salary entry:', error);
        throw error;
      }
      
      console.log('Entry added successfully:', data);
      return { data, error: null };
    } catch (error: any) {
      console.error('Error adding salary entry:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add salary entry",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateEntry = async (id: string, updates: Partial<SalaryEntry>) => {
    try {
      console.log('Updating entry:', id, updates);
      const { data, error } = await supabase
        .from('salary_entries')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating salary entry:', error);
        throw error;
      }
      
      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating salary entry:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update salary entry",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      console.log('Deleting entry:', id);
      const { error } = await supabase
        .from('salary_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error deleting salary entry:', error);
        throw error;
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('Error deleting salary entry:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete salary entry",
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
