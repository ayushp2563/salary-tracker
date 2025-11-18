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

// Singleton channel management
let activeChannel: any = null;
let subscriberCount = 0;
const listeners: Set<() => void> = new Set();

const setupRealtimeSubscription = (userId: string) => {
  if (activeChannel) return;

  console.log('Setting up daily hours real-time subscription for user:', userId);
  
  activeChannel = supabase
    .channel(`daily_hours_${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'daily_hours',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        console.log('Daily hours real-time update received:', payload);
        // Notify all listeners
        listeners.forEach(listener => listener());
      }
    )
    .subscribe();
};

const cleanupRealtimeSubscription = () => {
  if (subscriberCount === 0 && activeChannel) {
    console.log('Cleaning up daily hours real-time subscription');
    supabase.removeChannel(activeChannel);
    activeChannel = null;
    listeners.clear();
  }
};

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
    if (!user) return;

    subscriberCount++;
    console.log('Daily hours subscriber count:', subscriberCount);

    fetchDailyHours();

    // Add listener for this component
    listeners.add(fetchDailyHours);

    // Setup subscription if not already active
    setupRealtimeSubscription(user.id);

    return () => {
      subscriberCount--;
      console.log('Daily hours subscriber count after cleanup:', subscriberCount);
      listeners.delete(fetchDailyHours);
      cleanupRealtimeSubscription();
    };
  }, [user?.id]);

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
