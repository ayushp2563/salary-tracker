
import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useRealtimeSubscription = (onUpdate: (payload: any) => void) => {
  const { user } = useAuth();

  // Use useCallback to prevent the effect from running on every render
  const stableOnUpdate = useCallback(onUpdate, []);

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
          stableOnUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [user?.id, stableOnUpdate]);
};
