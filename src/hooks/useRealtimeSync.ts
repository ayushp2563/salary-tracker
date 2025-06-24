
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { SalaryEntry } from './useSalaryEntries';

interface UseRealtimeSyncProps {
  onInsert: (entry: SalaryEntry) => void;
  onUpdate: (entry: SalaryEntry) => void;
  onDelete: (id: string) => void;
}

let activeChannel: any = null;
let subscriberCount = 0;

export const useRealtimeSync = ({ onInsert, onUpdate, onDelete }: UseRealtimeSyncProps) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      return;
    }

    subscriberCount++;
    console.log('Subscriber count:', subscriberCount);

    // Only create one channel for all subscribers
    if (!activeChannel) {
      console.log('Setting up real-time subscription for user:', user.id);
      
      activeChannel = supabase
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
              onInsert(payload.new as SalaryEntry);
              toast({
                title: "Entry Added",
                description: "Your salary entry has been saved!",
              });
            } else if (payload.eventType === 'UPDATE') {
              onUpdate(payload.new as SalaryEntry);
              toast({
                title: "Entry Updated",
                description: "Your salary entry has been updated!",
              });
            } else if (payload.eventType === 'DELETE') {
              onDelete(payload.old.id);
              toast({
                title: "Entry Deleted",
                description: "Your salary entry has been deleted!",
              });
            }
          }
        )
        .subscribe();
    }

    return () => {
      subscriberCount--;
      console.log('Subscriber count after cleanup:', subscriberCount);
      
      // Only cleanup the channel when no more subscribers
      if (subscriberCount === 0 && activeChannel) {
        console.log('Cleaning up real-time subscription');
        supabase.removeChannel(activeChannel);
        activeChannel = null;
      }
    };
  }, [user?.id, onInsert, onUpdate, onDelete]);
};
