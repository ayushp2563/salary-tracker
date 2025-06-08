
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Singleton to manage subscription state
class SubscriptionManager {
  private static instance: SubscriptionManager;
  private subscription: any = null;
  private subscribers: Set<(payload: any) => void> = new Set();
  private currentUserId: string | null = null;

  static getInstance(): SubscriptionManager {
    if (!SubscriptionManager.instance) {
      SubscriptionManager.instance = new SubscriptionManager();
    }
    return SubscriptionManager.instance;
  }

  subscribe(userId: string, callback: (payload: any) => void) {
    console.log('Adding subscriber for user:', userId);
    this.subscribers.add(callback);

    // If this is a new user or we don't have a subscription, create one
    if (this.currentUserId !== userId || !this.subscription) {
      this.cleanup();
      this.createSubscription(userId);
    }

    // Return cleanup function
    return () => {
      console.log('Removing subscriber for user:', userId);
      this.subscribers.delete(callback);
      
      // If no more subscribers, cleanup
      if (this.subscribers.size === 0) {
        this.cleanup();
      }
    };
  }

  private createSubscription(userId: string) {
    console.log('Creating new real-time subscription for user:', userId);
    this.currentUserId = userId;
    
    const channelName = `salary_entries_${userId}_${Date.now()}`;
    
    this.subscription = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'salary_entries',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          // Notify all subscribers
          this.subscribers.forEach(callback => callback(payload));
        }
      )
      .subscribe();
  }

  private cleanup() {
    if (this.subscription) {
      console.log('Cleaning up subscription manager');
      supabase.removeChannel(this.subscription);
      this.subscription = null;
      this.currentUserId = null;
    }
  }

  reset() {
    this.cleanup();
    this.subscribers.clear();
  }
}

export const useRealtimeSubscription = (onUpdate: (payload: any) => void) => {
  const { user } = useAuth();
  const manager = SubscriptionManager.getInstance();

  useEffect(() => {
    if (!user) {
      manager.reset();
      return;
    }

    const unsubscribe = manager.subscribe(user.id, onUpdate);
    
    return unsubscribe;
  }, [user?.id, onUpdate]);
};
