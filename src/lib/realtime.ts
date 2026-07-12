import { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type Handler = (payload: any) => void;

type ManagedChannel = {
  channel: RealtimeChannel;
  handlers: Set<Handler>;
  refCount: number;
};

const managed = new Map<string, ManagedChannel>();

/**
 * Safely share one Supabase realtime channel per topic.
 * supabase.channel(name) returns an existing instance — calling subscribe()
 * twice on it throws and white-screens the app.
 */
export function subscribeToTable(options: {
  name: string;
  table: string;
  filter?: string;
  onEvent: Handler;
}) {
  const { name, table, filter, onEvent } = options;
  let entry = managed.get(name);

  if (!entry) {
    const handlers = new Set<Handler>([onEvent]);
    const channel = supabase
      .channel(name)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          ...(filter ? { filter } : {}),
        },
        (payload) => {
          handlers.forEach((handler) => {
            try {
              handler(payload);
            } catch (error) {
              console.error('Realtime handler error', error);
            }
          });
        }
      );

    channel.subscribe((status) => {
      if (status === 'CHANNEL_ERROR') {
        console.error('Realtime channel error', name);
      }
    });

    entry = { channel, handlers, refCount: 1 };
    managed.set(name, entry);
  } else {
    entry.handlers.add(onEvent);
    entry.refCount += 1;
  }

  return () => {
    const current = managed.get(name);
    if (!current) return;
    current.handlers.delete(onEvent);
    current.refCount -= 1;
    if (current.refCount <= 0) {
      supabase.removeChannel(current.channel);
      managed.delete(name);
    }
  };
}

export function removeAllManagedChannels(client: SupabaseClient = supabase) {
  for (const [name, entry] of managed.entries()) {
    client.removeChannel(entry.channel);
    managed.delete(name);
  }
}
