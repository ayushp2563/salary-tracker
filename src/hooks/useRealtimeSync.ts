
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { SalaryEntry } from './useSalaryEntries';
import { isExpenseSalaryEntry } from '@/lib/expenseStorage';

interface UseRealtimeSyncProps {
  onInsert: (entry: SalaryEntry) => void;
  onUpdate: (entry: SalaryEntry) => void;
  onDelete: (id: string) => void;
}

export const useRealtimeSync = ({ onInsert, onUpdate, onDelete }: UseRealtimeSyncProps) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`salary_entries_${user.id}_${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'salary_entries',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const entry = payload.new as SalaryEntry;
            onInsert(entry);
            if (!isExpenseSalaryEntry(entry)) {
              toast({
                title: 'Entry Added',
                description: 'Your salary entry has been saved!',
              });
            }
          } else if (payload.eventType === 'UPDATE') {
            const entry = payload.new as SalaryEntry;
            onUpdate(entry);
            if (!isExpenseSalaryEntry(entry)) {
              toast({
                title: 'Entry Updated',
                description: 'Your salary entry has been updated!',
              });
            }
          } else if (payload.eventType === 'DELETE') {
            onDelete(payload.old.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, onInsert, onUpdate, onDelete]);
};
