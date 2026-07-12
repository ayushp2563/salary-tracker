import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { StudentRegion, StudentStatus } from '@/types/expense';

export interface StudentPrefs {
  preferred_currency: string;
  region: StudentRegion;
  student_status: StudentStatus;
  weekly_hour_cap: number;
}

const DEFAULTS: StudentPrefs = {
  preferred_currency: 'USD',
  region: 'US',
  student_status: 'domestic',
  weekly_hour_cap: 40,
};

const LOCAL_KEY = 'salary-tracker-student-prefs';

type ProfileExtras = {
  preferred_currency?: string | null;
  region?: string | null;
  student_status?: string | null;
  weekly_hour_cap?: number | null;
};

export const useStudentPrefs = () => {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<StudentPrefs>(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
    } catch {
      return DEFAULTS;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        if (data) {
          const row = data as ProfileExtras;
          const next: StudentPrefs = {
            preferred_currency: row.preferred_currency || DEFAULTS.preferred_currency,
            region: (row.region as StudentRegion) || DEFAULTS.region,
            student_status: (row.student_status as StudentStatus) || DEFAULTS.student_status,
            weekly_hour_cap: Number(row.weekly_hour_cap) || DEFAULTS.weekly_hour_cap,
          };
          setPrefs(next);
          localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
        }
      } catch {
        // Keep local prefs when columns are not yet migrated
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const savePrefs = async (updates: Partial<StudentPrefs>) => {
    const next = { ...prefs, ...updates };
    setPrefs(next);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(next));

    if (!user) return { error: null };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  return { prefs, loading, savePrefs };
};
