import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface DailyHours {
  id: string;
  user_id: string;
  date: string;
  hours_worked: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const useDailyHours = () => {
  const [dailyHours, setDailyHours] = useState<DailyHours[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchDailyHours = async () => {
    if (!user) {
      setDailyHours([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('daily_hours')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setDailyHours(data || []);
    } catch (error: any) {
      console.error('Error fetching daily hours:', error);
      toast({
        title: "Error",
        description: "Failed to load daily hours",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyHours();

    // Real-time subscription
    const channel = supabase
      .channel('daily_hours_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'daily_hours',
          filter: `user_id=eq.${user?.id}`,
        },
        () => {
          fetchDailyHours();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const addDailyHours = async (data: Omit<DailyHours, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data: result, error } = await supabase
        .from('daily_hours')
        .insert([{ ...data, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Daily hours added successfully",
      });
      
      return { data: result, error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add daily hours",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateDailyHours = async (id: string, updates: Partial<DailyHours>) => {
    try {
      const { data, error } = await supabase
        .from('daily_hours')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Daily hours updated successfully",
      });
      
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update daily hours",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteDailyHours = async (id: string) => {
    try {
      const { error } = await supabase
        .from('daily_hours')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Daily hours deleted successfully",
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete daily hours",
        variant: "destructive",
      });
      return { error };
    }
  };

  const getTotalHours = () => {
    return dailyHours.reduce((sum, entry) => sum + Number(entry.hours_worked), 0);
  };

  return {
    dailyHours,
    loading,
    addDailyHours,
    updateDailyHours,
    deleteDailyHours,
    getTotalHours,
    refetch: fetchDailyHours,
  };
};
