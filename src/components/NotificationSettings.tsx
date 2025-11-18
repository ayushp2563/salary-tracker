import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Bell } from 'lucide-react';

export const NotificationSettings = () => {
  const { user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState('18:00');
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check if notifications are supported
    setIsSupported('Notification' in window && 'serviceWorker' in navigator);
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    // Load user preferences
    loadPreferences();
  }, [user]);

  const loadPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('notifications_enabled, notification_time')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setNotificationsEnabled(data.notifications_enabled || false);
        setNotificationTime(data.notification_time || '18:00');
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    }
  };

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Not Supported",
        description: "Notifications are not supported in your browser",
        variant: "destructive",
      });
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === 'granted') {
      toast({
        title: "Success",
        description: "Notification permissions granted!",
      });
      return true;
    } else {
      toast({
        title: "Permission Denied",
        description: "Please enable notifications in your browser settings",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleSave = async () => {
    if (!user) return;

    // Request permission if enabling notifications
    if (notificationsEnabled && permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) {
        setNotificationsEnabled(false);
        return;
      }
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          notifications_enabled: notificationsEnabled,
          notification_time: notificationTime,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Settings Saved",
        description: "Your notification preferences have been updated",
      });

      // Schedule notification if enabled
      if (notificationsEnabled) {
        scheduleNotification();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save settings",
        variant: "destructive",
      });
    }
  };

  const scheduleNotification = () => {
    // This is a simplified version - in production, you'd use a more sophisticated
    // scheduling system with the service worker
    const [hours, minutes] = notificationTime.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilNotification = scheduledTime.getTime() - now.getTime();

    setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification('Salary Tracker Reminder', {
          body: 'Don\'t forget to log your hours for today!',
          icon: '/icon-192.png',
          badge: '/icon-192.png',
        });
      }
    }, timeUntilNotification);
  };

  const testNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('Salary Tracker', {
        body: 'This is a test notification!',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
      });
    } else {
      requestPermission();
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Notifications are not supported in your browser or device
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Daily Reminder Notifications
        </CardTitle>
        <CardDescription>
          Get reminded to log your daily hours
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notifications-enabled">Enable Daily Reminders</Label>
            <p className="text-sm text-muted-foreground">
              Receive a notification to log your hours
            </p>
          </div>
          <Switch
            id="notifications-enabled"
            checked={notificationsEnabled}
            onCheckedChange={setNotificationsEnabled}
          />
        </div>

        {notificationsEnabled && (
          <div className="space-y-2">
            <Label htmlFor="notification-time">Reminder Time</Label>
            <Input
              id="notification-time"
              type="time"
              value={notificationTime}
              onChange={(e) => setNotificationTime(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              You'll receive a reminder at this time every day
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex-1">
            Save Preferences
          </Button>
          {permission === 'granted' && (
            <Button onClick={testNotification} variant="outline">
              Test
            </Button>
          )}
        </div>

        {permission === 'default' && (
          <p className="text-xs text-muted-foreground">
            You'll be asked for permission when you enable notifications
          </p>
        )}
        {permission === 'denied' && (
          <p className="text-xs text-destructive">
            Notifications are blocked. Please enable them in your browser settings.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
